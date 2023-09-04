import React, { useState, useEffect } from 'react';

const Rightbar = () => {
  const [news, setNews] = useState<any>([]);
  const Parser = require('rss-parser');
  const parser = new Parser();

  (async () => {
    const feed = await parser.parseURL('https://rss.app/feeds/g9tevEQUkRznLvwH.xml');
    // console.log(feed.title);
    feed.items.forEach((item: any) => {
      // console.log(item.title + ":" + item.link);
    });
  })();

  const url = 'https://rss.app/feeds/g9tevEQUkRznLvwH.xml';

  useEffect(() => {
    async function getNews() {
      const text = await fetch(url).then((r) => r.text());
      const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
      const items = Array.from(xmlDoc.querySelectorAll('item')).map((item: any) => ({
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').childNodes[0].data,
        link: item.querySelector('link').textContent,
      }));
      console.log(items);
      setNews(items);
    }
    getNews();
  }, []);

  return (
    <>
      <div className="rightbarContent">
        <div className="trends">
          Trending News
          {news.map((e: any) => {
            return (
              <>
                <div className="trend">
                  <div key={e.title}>
                    <h3>{e.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: e.description }} />
                    <a href={e.link} target="_blank" rel="noreferrer">
                      Read more!
                    </a>
                    <hr />
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Rightbar;
