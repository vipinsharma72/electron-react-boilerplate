/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */

import { Divider, Image } from 'antd';
import { useState } from 'react';
import doorClosed from '../../../assets/doorClosed.png';
import openedDoorAperture from '../../../assets/opened-door-aperture.png';
import temperature from '../../../assets/temperature.png';
import highTemperature from '../../../assets/high-temperature.png';
import humidity from '../../../assets/humidity.png';
import humidityData from '../../../assets/humidity(1).png';
import leaking from '../../../assets/leaking.png';
import smokeSecond from '../../../assets/smokeSecond.jpg';

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

function LiveData() {
  const [jsonData, setDataJson] = useState('');
  if (initFlag === false) {
    initFlag = true;
    window.electron.ipcRenderer.on('jsonData', (arg) => {
      // eslint-disable-next-line no-console
      // console.log(JSON.stringify(arg));
      // const str = String.fromCharCode.apply(null, arg);
      const decoder = new TextDecoder('utf-8');
      let str = decoder.decode(arg);
      str = str.substring(0, str.indexOf('}') + 1);
      // eslint-disable-next-line no-console
      console.log(str);
      // jsonData = arg;

      setDataJson(JSON.parse(str));
    });
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
  };

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
              src={getImageSource(name)}
              alt={name}
            />
            <p style={{ textAlign: 'center' }}>
              <b>{jsonDataMapping[name]}</b>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default LiveData;
