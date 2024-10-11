import { Divider, Image } from 'antd';
import { useState } from 'react';
import './liveData.css';
import doorClosed from '../../../assets/doorClosed.png';
import openedDoorAperture from '../../../assets/opened-door-aperture.png';
import temperature from '../../../assets/temperature.png';
import highTemperature from '../../../assets/high-temperature.png';
import humidity from '../../../assets/humidity.png';
import humidityData from '../../../assets/humidity(1).png';
import leaking from '../../../assets/leaking.png';
import smokeSecond from '../../../assets/smokeSecond.jpg';
import ntcImg1 from '../../../assets/room out temp.jpg';
import ntcImg2 from '../../../assets/home in temp.jpg';
import rainImg1 from '../../../assets/rainImg1.png';
import fanImg from '../../../assets/imgFan.jpg';
// import { json } from 'node:stream/consumers';

let initFlag = false;
// import { ipcRenderer } from 'electron';

// let jsonData = '';
// calling IPC exposed from preload script
// ipcRenderer.on('jsonData', (event, data) => {
//   //eslint-disable-next-line no-console
//   console.log(event);
//   // eslint-disable-next-line no-console
//   console.log(data);
// });

// eslint-disable-next-line react/prop-types
function LiveData({ setIsDisconnected }) {
  const [jsonData, setDataJson] = useState('');
  if (initFlag === false) {
    initFlag = true;
    let incomingData = '';
    window.electron.ipcRenderer.on('jsonData', (arg) => {
      setIsDisconnected(false);
      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(arg));
      // const str = String.fromCharCode.apply(null, arg);
      const decoder = new TextDecoder('utf-8');
      const str = decoder.decode(arg);
      // str = str.substring(0, str.indexOf('}') + 1);
      // eslint-disable-next-line no-console
      if (str.includes('{"Alarm"') && str.includes('}')) {
        incomingData = str;
        incomingData = incomingData.substring(0, incomingData.indexOf('}') + 1);
        setDataJson(JSON.parse(incomingData));
      } else if (str.includes('{"Alarm"')) {
        incomingData = str;
      } else if (str.includes('}')) {
        incomingData += str;
        incomingData = incomingData.substring(0, incomingData.indexOf('}') + 1);
        setDataJson(JSON.parse(incomingData));
      } else {
        incomingData += str;
      }
      // jsonData = arg;

      // setDataJson(JSON.parse(str));
    });

    // return () => {
    //   window.electron.ipcRenderer.removeAllListeners('jsonData');
    //   window.electron.ipcRenderer.removeAllListeners('deviceDisconnected');
    // };
  }

  const imageStates = {
    door: {
      isOpen: false,
      closedSrc: doorClosed,
      openSrc: openedDoorAperture,
    },
    temperature: {
      isOpen: false,
      closedSrc: temperature,
      openSrc: highTemperature,
    },
    humidity: {
      isOpen: false,
      closedSrc: humidity,
      openSrc: humidityData,
    },
    waterLeaked: {
      isOpen: false,
      closedSrc: leaking,
      openSrc: leaking,
    },
    smoke: {
      isOpen: false,
      closedSrc: smokeSecond,
      openSrc: smokeSecond,
    },
    ntc: {
      isOpen: false,
      closedSrc: ntcImg1,
      openSrc: ntcImg1,
    },
    ntc2: {
      isOpen: false,
      closedSrc: ntcImg2,
      openSrc: ntcImg2,
    },
    rain: {
      isOpen: false,
      closedSrc: rainImg1,
      openSrc: rainImg1,
    },
    Fan1: {
      isOpen: false,
      closedSrc: fanImg,
      openSrc: fanImg,
    },
    Fan2: {
      isOpen: false,
      closedSrc: fanImg,
      openSrc: fanImg,
    },
    Fan3: {
      isOpen: false,
      closedSrc: fanImg,
      openSrc: fanImg,
    },
    Fan4: {
      isOpen: false,
      closedSrc: fanImg,
      openSrc: fanImg,
    },
  };

  // const jsonData = {
  //   Alarm: 1,
  //   Lock: 1,
  //   Gate: 0,
  //   Humidity: 55,
  //   Temp: 26,
  //   TempAlarm: 0,
  //   HumidityAlarm: 0,
  //   Smoke: 0,
  //   SmokeLevel: 35,
  //   WaterLeakage: 0,
  //   WaterLeakageLevel: 40,
  //   NTC: 20,
  //   NTCAlarm: 1,
  //   NTC2: 30,
  //   NTCAlarm2: 1,
  //   RainLevel: 50,
  //   RainAlarm: 1,
  //   Fan1: 1,
  //   Fan2: 0,
  //   Fan3: 1,
  //   Fan4: 0,
  // };

  const getImageSource = (name) => {
    switch (name) {
      case 'door':
        return jsonData.Gate
          ? imageStates.door.openSrc
          : imageStates.door.closedSrc;
      case 'temperature':
        return jsonData.TempAlarm
          ? imageStates.temperature.openSrc
          : imageStates.temperature.closedSrc;
      case 'humidity':
        return jsonData.HumidityAlarm
          ? imageStates.humidity.openSrc
          : imageStates.humidity.closedSrc;
      case 'waterLeaked':
        return jsonData.WaterLeakage
          ? imageStates.waterLeaked.openSrc
          : imageStates.waterLeaked.closedSrc;
      case 'smoke':
        return jsonData.Smoke
          ? imageStates.smoke.openSrc
          : imageStates.smoke.closedSrc;
      case 'ntc':
        return jsonData.NTC
          ? imageStates.ntc.openSrc
          : imageStates.ntc.closedSrc;
      case 'rain':
        return jsonData.RainLevel
          ? imageStates.rain.openSrc
          : imageStates.rain.closedSrc;
      case 'ntc2':
        return jsonData.NTC2
          ? imageStates.ntc2.openSrc
          : imageStates.ntc2.closedSrc;
      case 'Fan1':
        return jsonData.Fan1
          ? imageStates.Fan1.openSrc
          : imageStates.Fan1.closedSrc;
      case 'Fan2':
        return jsonData.Fan2
          ? imageStates.Fan2.openSrc
          : imageStates.Fan2.closedSrc;
      case 'Fan3':
        return jsonData.Fan3
          ? imageStates.Fan3.openSrc
          : imageStates.Fan3.closedSrc;
      case 'Fan4':
        return jsonData.Fan4
          ? imageStates.Fan4.openSrc
          : imageStates.Fan4.closedSrc;
      default:
        return '';
    }
  };

  const isActive = (name) => {
    switch (name) {
      case 'door':
        return jsonData.Gate ? 'red' : '';
      case 'temperature':
        return jsonData.TempAlarm ? 'red' : '';
      case 'humidity':
        return jsonData.HumidityAlarm ? 'red' : '';
      case 'waterLeaked':
        return jsonData.WaterLeakage ? 'red' : '';
      case 'smoke':
        return jsonData.Smoke ? 'red' : '';
      case 'ntc':
        return jsonData.NTCAlarm ? 'red' : '';
      case 'ntc2':
        return jsonData.NTCAlarm2 ? 'red' : '';
      case 'rain':
        return jsonData.RainAlarm ? 'red' : '';
      default:
        return false;
    }
  };

  const jsonDataMapping = {
    door: jsonData.Gate ? 'Gate Opened' : 'Gate Closed',
    temperature: `Temp: ${jsonData.Temp}°C`,
    humidity: `Humidity: ${jsonData.Humidity}%`,
    waterLeaked: `Water Leakage Level: ${jsonData.WaterLeakageLevel}%`,
    smoke: `Smoke Level: ${jsonData.SmokeLevel}%`,
    ntc: `Ambient Temp: ${jsonData.NTC}°C`,
    ntc2: `Cabinet Temp: ${jsonData.NTC2}°C`,
    rain: `RainLevel: ${jsonData.RainLevel}%`,
    Fan1: jsonData.Fan1 ? 'ON' : 'OFF',
    Fan2: jsonData.Fan2 ? 'ON' : 'OFF',
    Fan3: jsonData.Fan3 ? 'ON' : 'OFF',
    Fan4: jsonData.Fan4 ? 'ON' : 'OFF',
  };

  const getImageClass = (name) => {
    if (['Fan1', 'Fan2', 'Fan3', 'Fan4'].includes(name)) {
      return jsonData[name] ? 'rotating' : '';
    }
    return '';
  };

  const imgString = `data:image/jpg;base64,${jsonData.Image}`;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          marginTop: '50px',
          flexWrap: 'wrap',
        }}
      >
        {Object.entries(imageStates).map(([name]) => (
          <div
            key={name}
            style={{
              textAlign: 'center',
              background: isActive(name),
              width: '150px',
              height: '200px',
              borderRadius: '5px',
            }}
          >
            <Divider />
            <Image
              style={{ width: '100px', height: '100px' }}
              className={getImageClass(name)}
              src={getImageSource(name)}
              alt={name}
            />
            <p style={{ textAlign: 'center' }}>
              <b>{jsonDataMapping[name]}</b>
            </p>
          </div>
        ))}
      </div>
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <img
          style={{ width: '50%', height: '50%' }}
          src={imgString}
          alt="jpgImg"
        />
      </div>
    </div>
  );
}
export default LiveData;
