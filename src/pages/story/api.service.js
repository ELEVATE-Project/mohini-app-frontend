import axiosInstance from "../../utils/axios";

const getStoryByIdUrl = (id) => `/api/story/${id}/`;
const get_all_story_media_url = "/api/storymedia/";
const create_story_media_url = "/api/storymedia/";
const update_story_media_url = (id) => `/api/storymedia/${id}/`;

export async function createAuthRequest({
  loader = () => {},
  setter = () => {},
  errorHandler = () => {},
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
      url: `${url}`,
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
    errorHandler({
     response: error?.request?.response,
     status: error?.request?.status
    });
    loader(false);
  }
}


export const getStoryById = async ({
  loader,
  setter,
  token,
  data = {
    id: "",
  },
}) => {
  try {
    await createAuthRequest({
      loader,
      setter,
      token,
      method: "GET",
      url: getStoryByIdUrl(data.id),
    });
  } catch (error) {
    console.error(error);
  }
};

export const getStoryAllMedia = async ({
  loader,
  setter,
  token,
  data = {
    story: "",
  },
}) => {
  try {
    await createAuthRequest({
      loader,
      setter,
      token,
      params: data,
      method: "GET",
      url: get_all_story_media_url,
    });
  } catch (error) {
    console.error(error);
  }
};

export const createStoryMedia = async ({
  loader,
  setter,
  errorHandler,
  token,
  data = {
    story: "",
    name: "",
    file: [],
  },
}) => {
  try {
    await createAuthRequest({
      loader,
      setter,
      errorHandler,
      token,
      data,
      method: "POST",
      url: create_story_media_url,
    });
  } catch (error) {
    console.error(error);
  }
};


export const partialUpdateStoryById = async ({
  loader,
  setter,
  errorHandler,
  token,
  data = {
    id : "",
    formatted_content: "",
  },
}) => {
  try {
    await createAuthRequest({
      loader,
      setter,
      errorHandler,
      token,
      data: {
        formatted_content: JSON.stringify(data?.formatted_content)
      },
      method: "PATCH",
      url: getStoryByIdUrl(data?.id),
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateStoryMedia = async ({
  loader,
  setter,
  errorHandler,
  token,
  data = {
    story: "",
    name: "",
    file: [],
    id: ""
  },
}) => {
  try {
    const formData = new FormData();
    formData.append('story', data.story);
    formData.append('name', data.name);
    formData.append('file', data.file);
    formData.append('media_type', data.media_type);
    await createAuthRequest({
      loader,
      setter,
      errorHandler,
      token,
      data: formData,
      method: "PUT",
      url: update_story_media_url(data?.id),
    });
  } catch (error) {
    console.error(error);
  }
};