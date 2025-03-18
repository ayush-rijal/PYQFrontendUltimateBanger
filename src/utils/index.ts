import continueWithSocialAuth from "./continue-with-social-auth";

export const continueWithGoogle = () =>
  continueWithSocialAuth("google-oauth2", "google"); //first is provider seocnd is redirect 
export const continueWithFacebook = () =>
  continueWithSocialAuth("facebook", "facebook");
