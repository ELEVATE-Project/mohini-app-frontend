import axiosInstance from "../../utils/axios";

const translate_text_api = "/api/translate-text";
const send_audio_api = "/api/send-audio";

export async function createAuthRequest({
  loader = () => {},
  setter = () => {},
  token = "",
  data = {},
  method = "",
  url = "",
  params = {},
}) {
  try {
    if (!token && !url && !method) {
      throw new Error("Insufficient data!");
    }
    loader(true);
    const response = await axiosInstance({
      url,
      method,
      data,
      params,
      headers: {
        Authorization: token,
      },
    });
    setter(response?.data || {});
    loader(false);
  } catch (error) {
    console.error({ error });
    loader(false);
  }
}
