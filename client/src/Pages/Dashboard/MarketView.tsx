import React from 'react';
import { useParams } from 'react-router-dom';

import Market from "../Market/index"

const MarketView = () => {
  const { userId } = useParams<{ userId: string }>();
  
  return (
    <div>
      <Market basePath={`/dashboard/${userId}/market`} />
    </div>
  );
};

export default MarketView;
