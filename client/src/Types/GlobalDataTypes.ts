import type {
  iCreatorVideo,
  iChannelsInfo,
  iUserProfile,
} from "./UserStuffTypes";

export interface iGlobalData {
  creatorVideos: iCreatorVideo[];
  setCreatorVideo: React.Dispatch<React.SetStateAction<iCreatorVideo[] | null>>;
  creatorInfo: iChannelsInfo;
  setCreatorInfo: React.Dispatch<React.SetStateAction<iChannelsInfo | null>>;
  userInfo: iUserProfile;
  testInfo: iTestInfo;
  setTestInfo: React.Dispatch<React.SetStateAction<iTestInfo>>;
}

export interface iTestVideos {
  video_id: string;
  video_title: string;
  video_thumbnail: string;
  published_at: number;
  video_views: string;
}

export interface iTestInfo {
  testToRun: string; // What test? Thumb, title, both
  video_info: iTestVideos | null; // The video to run the test on
  how_often: string; //Hourly or dialy
  how_long: string; // How long is the test going to run
  test_start_date: string;
}

export interface iWaiterInfo {
  email: string;
  name: string;
}