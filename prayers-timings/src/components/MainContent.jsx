// eslint-disable-next-line no-unused-vars
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import Select from "@mui/material/Select";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

export default function MainContent() {
  const [timings, setTimings] = useState({
    Fajr: "04:49",
    Dhuhr: "11:52",
    Asr: "15:10",
    Maghrib: "17:38",
    Isha: "19:08",
  });

  const [selectedCity, setSelectedCity] = useState({
    displayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
  });

  const avilableCities = [
    {
      displayName: "مكة المكرمة",
      apiName: "Makkah al Mukarramah",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },
  ];

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
    );
    console.log("this data is: ", response.data.data.timings);
    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    console.log("calling the api", selectedCity);
    getTimings();
  }, [selectedCity]);

  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    console.log("the new value is: ", event.target.value);
    // setSelectedCity(event.target.value);
    setSelectedCity(cityObject);
  };

  return (
    <>
      {/* TOP ROW */}
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>سبتمبر 4:30 2023 9 </h2>
            <h1>{selectedCity.displayName} </h1>
          </div>
        </Grid>

        <Grid xs={6}>
          <div>
            <h2>متبقي حتى صلاة العصر </h2>
            <h1>00:43:12</h1>
          </div>
        </Grid>
      </Grid>
      {/* TOP ROW */}

      <Divider style={{ borderColor: "white", opacity: "0.1" }} />

      {/* PRAYERS CARDS */}

      <Stack
        direction="row"
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
      >
        <Prayer
          name="الفجر"
          time={timings.Fajr}
          image="src/assets/sunset-prayer-mosque.png"
        />
        <Prayer
          name="الظهر"
          time={timings.Dhuhr}
          image="src/assets/night-prayer-mosque.png"
        />
        <Prayer
          name="العصر"
          time={timings.Asr}
          image="src/assets/fajr-prayer (1).png"
        />
        <Prayer
          name="المغرب"
          time={timings.Maghrib}
          image="src/assets/dhhr-prayer-mosque.png"
        />
        <Prayer
          name="العشاء"
          time={timings.Isha}
          image="src/assets/asr-prayer-mosque.png"
        />
      </Stack>
      {/* PRAYERS CARDS */}
      {/* SELECT CITY */}
      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="city"
            value={selectedCity.apiName}
            onChange={handleCityChange}
          >
            {avilableCities.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}



//note
  /* if we don't want to use map we can use this */
  /* <MenuItem
              value={{
                displayName: "مكة المكرمة",
                apiName: "Makkah al Mukarramah",
              }}
            >
              مكة المكرمة
            </MenuItem>
            <MenuItem
              value={{
                displayName: "الرياض",
                apiName: "Riyadh",
              }}
            >
              الرياض
            </MenuItem> */
