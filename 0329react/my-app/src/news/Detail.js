import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GET_NEWS_DETAIL } from './data/api_config.js'
import { HOST } from './data/api_config.js'
import { motion } from 'framer-motion'
import AutoScrollToTop from './AutoScrollToTop.js'

function Detail() {
  const [news, setNews] = useState({});
  const itemId = useLocation().pathname.split('/')[3];
  let processFetch = true;
  let linkState = null;
  
  const parseJson = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (ex) {
      return null;
    }
  };
  
  const fetchData = async () => {
    try {
      const res = await fetch(`${GET_NEWS_DETAIL}/${itemId}`);
      const data = await res.json();
      if (processFetch) {
        setNews(data);
      }
    } catch (error) {
      console.log('Error fetching news:', error);
    }
  };
  useEffect(() => {
  
    fetchData();
  }, []);
  
  linkState = parseJson(news.state);
  return (
    <>
      <AutoScrollToTop>
        <div className="container-fluid d-none d-md-block nav-space pb-5">
          <div className="container">
            <div className="row sec-navbar">
              <div className="col-auto">
                <Link to="/" className="me-1">
                  首頁
                </Link>
                /
                <Link to="/news" className="me-1">
                  最新消息
                </Link>
                /
                <Link to="#" className="me-1">
                  {news.title}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <section className="container-fluid nav-space pt-md-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 200, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: window.innerWidth }}
            transition={{ duration: 0.8, type: 'linear' }}
          >
            <div className="container">
              <div className="row ">
                <div className="col-8 m-auto">
                  <img
                    src={news?.imgSrc && `${HOST}/news_img/${news.imgSrc}`}
                    alt="messageImage"
                    className="w-100"
                  />
                  <h2 className="mt-3">{news.title}</h2>
                  <p>
                    {news?.date && new Date(news.date).toJSON().slice(0, 10)}
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: news.content }} />
                  <Link to={news.btnUrl} state={linkState}>
                    <button className="o-line-btn j-h3 mt-2">
                      {news.btnText}{' '}
                      <i className="fa-solid fa-angles-right"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </AutoScrollToTop>
    </>
  )
}

export default Detail
