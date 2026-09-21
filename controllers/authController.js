const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

const createOtp = () => String(crypto.randomInt(100000, 1000000));

const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).send("An account with that email already exists");
        }

        const otp = createOtp();
        const hashedPassword = await bcrypt.hash(password, 10);

        req.session.pendingSignup = {
            username,
            email,
            password: hashedPassword,
            otpHash: hashOtp(otp),
            otpExpiresAt: Date.now() + 10 * 60 * 1000
        };

        try {
            await sendMail({
                from: process.env.MAIL_FROM || "no-reply@blog.local",
                to: email,
                subject: "Your Blog verification code",
                text: `Your Blog verification code is ${otp}. It expires in 10 minutes.`
            });
        } catch (error) {
            delete req.session.pendingSignup;
            throw error;
        }

        res.redirect("/verify-otp");
    } catch (error) {
        console.log(error);
        res.status(500).send("Signup Failed");
    }
};

const showVerifyOtp = (req, res) => {
    if (!req.session.pendingSignup) {
        return res.redirect("/signup");
    }

    res.render("auth/verify-otp");
};

const verifyOtp = async (req, res) => {
    try {
        const pendingSignup = req.session.pendingSignup;

        if (!pendingSignup) {
            return res.redirect("/signup");
        }

        if (Date.now() > pendingSignup.otpExpiresAt) {
            delete req.session.pendingSignup;
            return res.status(400).send("That verification code has expired");
        }

        if (hashOtp(req.body.otp) !== pendingSignup.otpHash) {
            return res.status(400).send("Invalid verification code");
        }

        await User.create({
            username: pendingSignup.username,
            email: pendingSignup.email,
            password: pendingSignup.password,
            role: 'user'
        });

        delete req.session.pendingSignup;
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.status(500).send("Verification failed");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.send("Invalid email or password");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.send("Invalid email or password");
        }

        req.session.userId = user._id;
        req.session.role = user.role;
        res.redirect("/posts");
    } catch (error) {
        console.log(error);
        res.status(500).send("Login failed");
    }
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

module.exports = {
    signup,
    showVerifyOtp,
    verifyOtp,
    login,
    logout
};
