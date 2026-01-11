import React, { useState, createContext, useEffect } from "react";

// Types
import type { iGlobalData } from "../Types/GlobalDataTypes";
import type { iCreatorVideo, iChannelsInfo } from "../Types/UserStuffTypes";

// API Endpoints
import { onGetConnectedData, onGetUserInfo } from "../API/endpoints";

// Global Context
const ContextGlobalData = createContext<iGlobalData | {}>({});

const GlobalDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [creatorInfo, setCreatorInfo] = useState<iChannelsInfo[] | null>(null);
  const [creatorVideos, setCreatorVideo] = useState<iCreatorVideo[] | null>([]);
  let [userInfo, setUserInfo] = useState({});

    const [testInfo, setTestInfo] = useState({
      testToRun: "", // What test? Thumb, title, both
      video_info: null, // The video to run the test on
      how_often: "", //Hourly or dialy
      how_long: "", // How long is the test going to run
      test_start_date: "",
    });

    useEffect(() => {
      (async () => {
        try {
          let res = await onGetUserInfo();
          // console.log(res);

          if (res.status === 200) {
            let { user_info } = res.data;

            setUserInfo(user_info);
          }
        } catch (error) {
          console.log("Something went wrong, please refresh again!");
        }
      })();
    }, []);

    useEffect(() => {
      (async () => {
        try {
          let res = await onGetConnectedData();

          if (res.status === 200) {
            let { channel_info, creator_videos } = res.data;

            setCreatorInfo(channel_info);
            setCreatorVideo(creator_videos);
          }
        } catch (error) {
          console.log("Something went wrong, please refresh again!");
        }
      })();
    }, []);

    return (
      <ContextGlobalData.Provider
        value={{
          creatorInfo,
          setCreatorInfo,
          creatorVideos,
          setCreatorVideo,
          userInfo,
          testInfo,
          setTestInfo,
        }}>
        {children}
      </ContextGlobalData.Provider>
    );
};

export { GlobalDataProvider, ContextGlobalData };
