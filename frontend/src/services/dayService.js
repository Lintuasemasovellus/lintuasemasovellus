import axios from "axios";

export const getDays = async () => {
  const days = await axios.get("/api/listDays");
  return days.data;
};

export const postDay = async (day) => {
  return await axios.post("/api/addDay", day);
};

export const editComment = async (dayId, comment) => {
  return await axios.post(`/api/editComment/${dayId}/${comment}`);
};

export const editObservers = async (dayId, observers) => {
  return await axios.post(`/api/editObservers/${dayId}/${observers}`);
};

export const getLocationsAndTypes = async (observatory) => {
  const locationsTypes = await axios.get(`/api/getLocationsAndTypes/${observatory}`);
  return locationsTypes.data;
};

export const searchDayInfo = async (date, observatory) => {
  const day = await axios.get(`/api/searchDayInfo/${date}/${observatory}`);
  return day.data;
};

export const getLatestDays = async (observatory) => {
  const days = await axios.get(`/api/getLatestDays/${observatory}`);
  return days.data;
};

export const getSummary = async (dayId) => {
  const summary = await axios.get(`/api/getObservationSummary/${dayId}`);
  return summary.data;
};

export const getShorthandText = async (dayId, type, location) => {
  const shorthand = await axios.get(`/api/getShorthandText/${dayId}/${type}/${location}`);
  return shorthand.data;
};

export const sendEverything = async (everything) => {
  const res = await axios.post("/api/addEverything", everything);
  return res;
};
