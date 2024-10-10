import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import axios from "axios";
import OauthUser from "../models/OauthUser.model";
import Profile from "../models/profile.model";
import { ApiError } from "../utils/apiError.utils";

const clientOriginalURL = "http://localhost:3000";

export async function httpGithubAccessToken(
  req: Request<any, Response, any, { code: string }>,
  res: Response,
  next: NextFunction
) {
  const { code } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    if (!clientId || !clientSecret) {
      throw new ApiError(
        400,
        "GitHub `client id` or `client secret` is undefined!"
      );
    }
    if (!code) {
      throw new ApiError(400, "Required property wasn't provided!");
    }

    axios
      .post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        },
        { headers: { Accept: "application/json" } }
      )
      .then(async (oauthResponse) => {
        const accessToken = oauthResponse.data.access_token;

        if (!accessToken) {
          throw new Error();
        }

        const { data } = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!data?.id) {
          throw new Error();
        }

        const oauthUser = await OauthUser.findOne({
          userId: data.id,
          platform: "GitHub",
        });

        if (!oauthUser) {
          const newOauthUser = new OauthUser({
            userId: data.id,
            platform: "GitHub",
          });
          await newOauthUser.save();
        }

        res.cookie(
          "token",
          JSON.stringify({
            value: accessToken,
            platform: "GitHub",
          }),
          {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
          }
        );

        res.redirect(clientOriginalURL);
      });
  } catch (err) {
    next(err);
  }
}

export async function httpGithubFinalSteps(
  req: AuthenticatedRequest<any, Response, { username: string }>,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;
  const token = JSON.parse(req.cookies.token || "");

  try {
    if (!token?.value) {
      throw new ApiError(400, "Authentication required!");
    }
    if (!username?.trim().length) {
      throw new ApiError(400, "Property `username` wasn't provided!");
    }

    const { data } = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!data) {
      throw new ApiError(400, "Authentication required!");
    }

    const oauthUser = await OauthUser.findOne({
      userId: data.id,
      platform: "GitHub",
    });

    if (!oauthUser) {
      throw new ApiError(400, "User not found");
    }

    oauthUser.username = username;
    await oauthUser.save();

    const profile = new Profile({ _id: oauthUser._id });
    await profile.save();

    res.json({ username });
  } catch (err) {
    next(err);
  }
}
