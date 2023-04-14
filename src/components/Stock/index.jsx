import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import {
  Box,
  CardContent,
  TextField,
  Typography,
  CardActions,
  Card,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "react-query";
import moment from "moment";
import { H1, P, Ul, Li } from "./style";
import { time } from "../Graph/timeStab";
import "./style.css";

function Stock() {
  const [selectedStock, setSelectedStock] = useState("");
  const [callApi, setCallApi] = useState(false);
  const [search, setSearch] = useState("");
  const [stockTime, setStockTime] = useState("1h");
  const columns = [
    {
      headerName: "Symbol",
      field: "name",
    },
  ];

  const stockApi = {
    method: "GET",
    url: "https://twelve-data1.p.rapidapi.com/stocks",
    params: { exchange: "NASDAQ", format: "json" },
    headers: {
      "X-RapidAPI-Key": "803a9bfde2mshf98915670aeff59p18faa8jsn55515d8a511d",
      "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com",
    },
  };

  const stockDetail = {
    method: "GET",
    url: "https://twelve-data1.p.rapidapi.com/time_series",
    params: {
      symbol: selectedStock.symbol,
      interval: stockTime,
      outputsize: "30",
      format: "json",
    },
    headers: {
      "X-RapidAPI-Key": "803a9bfde2mshf98915670aeff59p18faa8jsn55515d8a511d",
      "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com",
    },
  };

  const currentStockPrice = {
    method: "GET",
    url: "https://twelve-data1.p.rapidapi.com/price",
    params: { symbol: selectedStock.symbol, format: "json", outputsize: "30" },
    headers: {
      "X-RapidAPI-Key": "803a9bfde2mshf98915670aeff59p18faa8jsn55515d8a511d",
      "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com",
    },
  };

  const { isLoading, data } = useQuery(
    "stockData",
    () => axios.request(stockApi).then((res) => res.data.data),
    {
      retry: 2,
      retryDelay: (attemptIndex) => attemptIndex * 1000 * 60,
      refetchOnWindowFocus: false,
    }
  );

  const { data: stock, refetch } = useQuery(
    "stockPrice",
    () => axios.request(stockDetail).then((res) => res.data),
    {
      enabled: callApi,
      refetchOnWindowFocus: false,
    }
  );
  const openPrice = stock?.values?.[29]?.open;
  const closePrice = stock?.values?.[29]?.close;
  const highPrice = stock?.values?.[29]?.high;
  const lowPrice = stock?.values?.[29]?.low;
  const volume = stock?.values?.[29]?.volume;

  const { data: currentPrice, refetch: currentPriceRefetch } = useQuery(
    ["currentStockPrice", currentStockPrice],
    () => axios.request(currentStockPrice).then((res) => res.data.price),
    {
      enabled: callApi,
      refetchOnWindowFocus: false,
    }
  );
  const stockData = stock?.values;

  const handleRowClick = (params) => {
    const projectId = params.row;
    setSelectedStock(projectId);
    setCallApi(true);
    refetch();
    // currentPriceRefetch();
  };
  const series = [
    {
      name: "price",
      // data: ["10", "20"],
      data: stockData ? stockData.map((item) => item.close) : [],
      color: "green",
    },
  ];

  const options = {
    chart: {
      id: "trading",
    },
    title: {
      text: selectedStock.name,
      style: {
        color: "grey",
      },
    },
    stroke: {
      curve: "smooth",
      color: "black",
    },
    theme: {
      palette: "palette1", // upto palette10
    },
    fill: {
      type: "pattern",
      pattern: {
        style: "verticalLines",
        width: 5,
        height: 5,
        strokeWidth: 4,
        color: "pink",
      },
    },
    markers: {
      size: 1.5,
      // markerColor: "black",
      colors: ["#E91E63"],
    },
    xaxis: {
      type: "datetime",
      categories: stockData
        ? stockData.map((item) => moment().format(item.datetime))
        : [],
      reverse: false,
    },
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    console.log("----", time);
  };

  const handleStockTime = (time) => {
    setStockTime(time);
    refetch();
    currentPriceRefetch();
    console.log("heelo");
  };
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        margin: "0.5rem",
        marginTop: "0",
        background: "linear-gradient(210deg,lightpink, white)",
      }}
    >
      <Box
        display="flex"
        sx={{
          marginTop: "2rem",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "10%" }}>
          <h1>hello</h1>
        </Box>
        <Box
          sx={{
            margin: "0.5rem 0 0 0.5rem",
            // background: "grey",
          }}
        >
          <Box
            display="flex"
            sx={{
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: "bold" }}>current</Typography>
              <Typography>${currentPrice}</Typography>
            </CardContent>
            <CardContent>
              <Typography sx={{ fontWeight: "bold" }}>open</Typography>
              <Typography>${openPrice}</Typography>
            </CardContent>
            <CardContent>
              <Typography sx={{ fontWeight: "bold" }}>close</Typography>
              <Typography>${openPrice}</Typography>
            </CardContent>
            <CardContent>
              <Typography sx={{ fontWeight: "bold" }}>high</Typography>
              <Typography>${highPrice}</Typography>
            </CardContent>
            <CardContent>
              <Typography sx={{ fontWeight: "bold" }}>low</Typography>
              <Typography>${lowPrice}</Typography>
            </CardContent>
            <CardContent>
              <Typography sx={{ fontWeight: "bold" }}>volume</Typography>
              <Typography>${volume}</Typography>
            </CardContent>
          </Box>
          <Box sx={{ marginTop: "1.5rem" }}>
            <Chart
              options={options}
              series={series}
              width={900}
              height={500}
              type="line"
            />
          </Box>
          <Box display="flex" sx={{ justifyContent: "flex-end" }}>
            {time.map((item) => (
              <Ul key={item.id} onClick={() => handleStockTime(item.time)}>
                <Li>{item.time}</Li>
              </Ul>
            ))}
          </Box>
        </Box>
        <Box
          display="flex"
          sx={{
            marginTop: "1rem",
            height: "95%",
            width: "20%",
            // width: "contents",
            flexDirection: "column",
            alignItems: "center",
            border: "0.5px solid black",
            padding: 0,
          }}
        >
          <Box sx={{ margin: 0, padding: 0 }}>
            <TextField
              id="standard-search"
              label="Search field"
              type="search"
              variant="standard"
              value={search}
              onChange={handleSearch}
            />
          </Box>
          <Box
            sx={{
              // height: "100%",
              width: "100%",
              display: "contents",
            }}
          >
            {isLoading ? (
              <H1>loading</H1>
            ) : (
              <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row.symbol}
                onRowClick={handleRowClick}
                autoPageSize={true}
                hideFooterSelectedRowCount={true}
                alignCenter={true}
                m={0}
                sx={{
                  height: "80%",
                  width: "100%",
                  "& .MuiDataGrid-cell--textCenter": {
                    align: "center",
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Stock;
