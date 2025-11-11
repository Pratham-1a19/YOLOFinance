import { Response } from "express";
import { AuthRequest } from "../definitions/AuthRequest";
import { User } from "../model/user";
import { sendEmail } from "../handlers/sendEmail";
import crypto from "crypto";
import Invite from "../model/inviteModel";

export async function sendInvite(req: AuthRequest, res: Response) {
  const { email } = req.body;
  const { name, _id } = req.user;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await Invite.create({
      senderId: _id,
      receiverEmail: email,
      token,
    });
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "New Invite Recieved",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <h2 style="color: #333;">👋 Hello!</h2>
          <p><strong>${name}</strong> has invited you to join a group on <b>YOLOFinance</b>.</p>
          <p>Click the button below to accept the invite:</p>
          <a href="http://localhost:5173/invite/${token}" 
             style="display: inline-block; padding: 10px 20px; background: #007bff; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 10px;">
             Accept Invite
          </a>
          <p style="margin-top: 20px; color: #555;">If you didn’t expect this email, you can safely ignore it.</p>
          <hr style="margin-top: 20px;">
          <small style="color: #888;">This is a system-generated email. Please do not reply.</small>
        </div>
      `,
    };

    await sendEmail(mailOptions);

    res.status(200).send({ message: "Invite send successfully" });
  } catch (error) {
    console.log(error);
  }
}

export async function handleInviteResponse(req: AuthRequest, res: Response) {
  const { token } = req.params;
  const { response } = req.body;
  const currentUser = req.user;

  const invite = await Invite.findOne({ token });
  if (!invite)
    return res.status(400).json({ message: "Invalid or expired invite" });

  if (response === "accept") {
    const sender = await User.findById(invite.senderId);
    const receiver = currentUser;

    if (!sender) {
      return res.status(400).json({ message: "Sender not found" });
    }

    sender.connections.push(receiver._id);
    receiver.connections.push(sender._id);
    await sender.save();
    await receiver.save();

    invite.status = "accepted";
    await invite.save();

    res.json({ message: "Invite accepted!" });
  } else {
    invite.status = "declined";
    await invite.save();
    res.json({ message: "Invite declined" });
  }
}
