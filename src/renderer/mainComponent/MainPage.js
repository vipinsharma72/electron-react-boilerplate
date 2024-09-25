/* eslint-disable prettier/prettier */
import { Segmented, Input, Divider } from 'antd';
import { useState } from 'react';
import LiveData from './LiveData';
import History from './History';

function MainPage() {
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState(null);

  // window.electron.ipcRenderer.on('ipAddress', (arg) => {
  //   // eslint-disable-next-line no-console
  //   console.log('ipaddress:', arg);
  // });

  window.electron.ipcRenderer.on('ipPortData', (arg) => {
    // console.log(arg);
    // eslint-disable-next-line no-console
    setIpAddress(arg.ipAddress);

    setPort(arg.port);
  });

  const [segmented, setSegmented] = useState('live');
  // const [ipAddress, setIpAddress] = useState('');

  const SegmentOptions = [
    { label: 'Live', value: 'live' },
    { label: 'History', value: 'history' },
  ];

  // useEffect(() => {
  //   async function fetchIPAddress() {
  //     const ip = await window.electron.getIPAddress();
  //     setIpAddress(ip);
  //   }

  //   fetchIPAddress();
  // }, []);

  return (
    <div
      style={{
        padding: '20px',
        width: '-webkit-fill-available',
        backgroundColor: 'white',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          disabled
          placeholder="IP address"
          value={ipAddress}
          style={{ width: '250px' }}
        />
        <Input
          disabled
          placeholder="Port"
          value={port}
          style={{ width: '250px' }}
        />
      </div>
      <Divider />
      <Segmented
        options={SegmentOptions}
        onChange={(segment) => setSegmented(segment)}
      />
      {segmented === 'live' ? <LiveData /> : <History />}
    </div>
  );
}

export default MainPage;
