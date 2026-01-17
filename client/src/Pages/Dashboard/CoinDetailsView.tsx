import React from 'react';
import { useParams } from 'react-router-dom';
import CoinDetails from '../../Components/Coin/CoinDetails';

const CoinDetailsView = () => {
  const { coinId } = useParams<{ coinId: string }>();
  
  return <CoinDetails hideLayout coinId={coinId} />;
};

export default CoinDetailsView;
