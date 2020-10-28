import { Flex, Spinner, Box } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import DaoOverviewDetails from '../../components/Dao/DaoOverviewDetails';
import MemberInfoCard from '../../components/Dao/MemberInfoCard';

import GraphFetch from '../../components/Shared/GraphFetch';
import { useDao, useUser, useLoading } from '../../contexts/PokemolContext';
import { HOME_DAO } from '../../utils/apollo/dao-queries';

const Dao = () => {
  const [daoGraphData, setDaoGraphData] = useState();
  const [dao, updateDao] = useDao();
  const [user] = useUser();
  const [loading, updateLoading] = useLoading();
  console.log(dao);

  useEffect(() => {
    if (daoGraphData) {
      // TODO: do updates in other spots override each other?
      updateDao({
        ...dao,
        graphData: daoGraphData.moloch,
      });
      updateLoading(false);
    }
  }, [daoGraphData]);

  return (
    <>
      {!dao ? (
        <Spinner />
      ) : (
        <div>
          {dao.graphData ? (
            <Flex>
              <Box w='50%' mr={6}>
                <DaoOverviewDetails dao={dao} />
              </Box>
              <Box w='40%'>
                <MemberInfoCard user={user} />
              </Box>
            </Flex>
          ) : null}

          <GraphFetch
            query={HOME_DAO}
            setRecords={setDaoGraphData}
            entity='moloches'
            variables={{ contractAddr: dao.address }}
          />
        </div>
      )}
    </>
  );
};

export default Dao;
