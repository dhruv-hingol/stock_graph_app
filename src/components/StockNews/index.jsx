import React, { useState } from "react";
import {
  Box,
  CardContent,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
function StockNews() {
  const [openDialog, setOpenDialog] = useState(false);
  const [newsDataDetail, setNewsDataDetail] = useState({});
  const stockNews = {
    method: "GET",
    url: "https://reuters-business-and-financial-news.p.rapidapi.com/article-date/01-04-2021",
    headers: {
      "X-RapidAPI-Key": "803a9bfde2mshf98915670aeff59p18faa8jsn55515d8a511d",
      "X-RapidAPI-Host": "reuters-business-and-financial-news.p.rapidapi.com",
    },
  };
  const { isLoading, data: newsData } = useQuery("newsData", () =>
    axios.request(stockNews).then((res) => res.data)
  );

  const handleNews = (articlesName) => {
    const newsDetail = newsData.find(
      (news) => (news.articlesName = articlesName)
    );
    setNewsDataDetail(newsDetail);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        {isLoading ? (
          <h1>loading</h1>
        ) : (
          <Box>
            {newsData.map((item) => (
              <CardContent sx={{ borderTop: "0.5px solid black" }}>
                <Typography onClick={() => handleNews(item.articlesName)}>
                  {item.articlesName}
                </Typography>
              </CardContent>
            ))}
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              sx={{ color: "red" }}
            >
              <DialogTitle>{newsDataDetail?.articlesName}</DialogTitle>
              <DialogContent sx={{ background: "transparent" }}>
                <DialogContentText>
                  {newsDataDetail?.articlesShortDescription}
                </DialogContentText>
                <DialogContentText sx={{ fontWeight: "bold" }}>
                  Date:{moment().format(newsDataDetail?.publishedAt?.date)}
                </DialogContentText>
                <DialogContentText sx={{ fontWeight: "bold" }}>
                  Authors:
                  {newsDataDetail?.authors?.map((el) => (
                    <DialogContentText sx={{ textDecoration: "underline" }}>
                      {el?.authorName}
                    </DialogContentText>
                  ))}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default StockNews;
