import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers';

import { Box, Flex, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Chart from 'chart.js/auto';
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import '../Css/ChartsAndMaps.css';

const fetchChartData = async () => {
  return await axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
};

const ChartsAndMaps = () => {
  const [chartData, setChartData] = useState({});
  const [countryData, setCountryData] = useState([]);

  const fetchCountryData = async () => {
    const res = await axios.get('https://disease.sh/v3/covid-19/countries');
    const data = res.data;

    const countryData = data.map((country) => ({
      name: country.country,
      lat: country.countryInfo.lat,
      long: country.countryInfo.long,
      active: country.active,
      recovered: country.recovered,
      deaths: country.deaths,
    }));

    setCountryData(countryData);
  };

  useEffect(() => {
    fetchChartData().then((res) =>
      setChartData({
        labels: Object.keys(res.data.cases),
        datasets: [
          {
            label: 'COVID-19 Cases',
            data: Object.values(res.data.cases),
            backgroundColor: 'red',
          },
        ],
      })
    );
    fetchCountryData();
  }, []);

  useEffect(() => {
    const chartConfig = {
      type: 'line',
      data: chartData,
    };

    const myChart = new Chart(document.getElementById('myChart'), chartConfig);
    return () => {
      myChart.destroy();
    };
  }, [chartData]);

  return (
    <div>
      <Heading color={'white'} p={'10px 20px'} bg={'#28686e'}>
        Charts and Maps
      </Heading>
      <div id='charts_page_div'>
        {/* ... */}
        <Box padding={'30px'} margin={'auto'} w={'79%'} boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'} border={'1px solid gray'}>
          <Heading>COVID-19 Dashboard</Heading>
          <Box>
            {window.innerWidth > 900 ? (
              <canvas id='myChart' width='800' height='300'></canvas>
            ) : (
              <canvas id='myChart' width='400' height='300'></canvas>
            )}
          </Box>
          <br />
          <br />
          <Box>
            <MapContainer center={[0, 0]} zoom={2}>
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
              {countryData.map((country) => (
                <Marker
                  key={country.name}
                  position={[country.lat, country.long]}
                  icon={L.AwesomeMarkers.icon({
                    icon: 'coffee',
                    markerColor: 'blue',
                  })}
                >
                  <Popup>
                    <h4>Name: {country.name}</h4>
                    <p>Active Cases: {country.active}</p>
                    <p>Recovered Cases: {country.recovered}</p>
                    <p>Deaths: {country.deaths}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ChartsAndMaps;
