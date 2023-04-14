import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import {
  Box,
  TextField,
  CardContent,
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
import StockNews from "../StockNews";

function Stock() {
  const [selectedStock, setSelectedStock] = useState("AACG");
  const [callApi, setCallApi] = useState(false);
  const [search, setSearch] = useState("");
  const [stockTime, setStockTime] = useState("1h");
  const columns = [
    {
      headerName: "Symbol",
      field: "name",
      flex: 1,
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
    currentPriceRefetch();
  };
  const series = [
    {
      name: "price",
      data: stockData
        ? stockData.map((item) => ({
            x: item.datetime,
            y: [item.open, item.high, item.low, item.close],
          }))
        : [],
    },
  ];

  const options = {
    chart: {
      id: "trading",
      type: "candlestick",
      height: 350,
    },
    title: {
      text: selectedStock.name,
      style: {
        color: "grey",
      },
    },
    xaxis: {
      type: "datetime",
      categories: stockData
        ? stockData.map((item) => moment().format(item.datetime))
        : [],
      reverse: false,
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleStockTime = (time) => {
    setStockTime(time);
    refetch();
    currentPriceRefetch();
  };
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        margin: "0.5rem",
        marginTop: "0",
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
        <Box
          sx={{
            width: "18%",
            height: "100%",
            margin: "0rem",
            background: "white",
            // border: "1px solid black",
            overflowY: "auto",
            cursor: "pointer",
            boxShadow: "2px 2px 5px grey",
            "&::-webkit-scrollbar": {
              width: 1,
              height: 1,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        >
          <StockNews />
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
              type="candlestick"
            />
          </Box>
          <Box display="flex" sx={{ justifyContent: "flex-end" }}>
            {time.map((item) => (
              <Ul key={item.id} onClick={() => handleStockTime(item.time)}>
                <Li>{item.time}</Li>
              </Ul>
            ))}
          </Box>
          {/* <Box sx={{ textAlign: "center" }}> */}
          {/* <h1>developed by dhruv hingol</h1> */}
          {/* </Box> */}
        </Box>
        <Box
          display="flex"
          sx={{
            marginTop: "1rem",
            marginRight: "1rem",
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
                  headerAlign: "center",
                  fontWeight: "bold",
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
