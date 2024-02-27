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
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function MainContent() {
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

  const [timings, setTimings] = useState({
    Fajr: "04:49",
    Dhuhr: "11:52",
    Asr: "15:10",
    Maghrib: "17:38",
    Isha: "19:08",
  });

  const [remainingTime, setRemainingTime] = useState("");

  const [selectedCity, setSelectedCity] = useState({
    displayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
  });

  const [today, setToday] = useState("");

  // const [timer, setTimer] = useState(10);

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

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
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

  useEffect(() => {
    let interval = setInterval(() => {
      // setTimer((t) => {
      //   return t - 1;
      // });
      setupCountDownTimer();
    }, 1000);
    const t = moment();
    setToday(t.format("MMM Do YYYY | hh:mm"));
    console.log("the time is: ", t.format("Y"));

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountDownTimer = () => {
    //determine the current time
    const currentMoment = moment();

    //determine the next prayer
    let prayerIndex = 2;

    if (
      currentMoment.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      currentMoment.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      currentMoment.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      currentMoment.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      currentMoment.isAfter(moment(timings["Asr"], "hh:mm")) &&
      currentMoment.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      currentMoment.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      currentMoment.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time.
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(currentMoment);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(currentMoment);
      const midNight = moment("00:00:00", "hh:mm:ss");
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(midNight);

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }
    console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
    console.log(
      "duration issss ",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );
  };
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
            <h2> {today} </h2>
            <h1>{selectedCity.displayName} </h1>
          </div>
        </Grid>

        <Grid xs={6}>
          <div>
            <h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName} </h2>
            <h1>{remainingTime}</h1>
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
