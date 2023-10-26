import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styles from "./JobPage.module.css"

const JobPage = () => {
  const [jobIds, setJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
      .then((response) => response.json())
      .then((data) => setJobIds(data));
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * jobsPerPage;
    const endIndex = page * jobsPerPage;
    const jobIdsToFetch = jobIds.slice(startIndex, endIndex);

    Promise.all(jobIdsToFetch.map(fetchJobDetails)).then((jobData) =>
      setJobs([...jobs, ...jobData])
    );
  }, [jobIds, page]);

  const fetchJobDetails = (jobId) => {
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${jobId}.json`)
      .then((response) => response.json());
  };

  const loadMoreJobs = () => {
    setPage(page + 1);
  };
  
  return (
    <div>
      <ul className={styles.job_section}>
        {jobs.map((job) => (
          <li key={job.id} className={styles.job_card}>
            <a href={job.url} target="_blank" rel="noopener noreferrer" className={styles.job_title}>{job.title}</a>
            <p>Posted by {job.by} on {new Date(job.time * 1000).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      {jobs.length < jobIds.length && (
        <button className={styles.load_btn} onClick={loadMoreJobs}>Load more</button>
      )}
      
    </div>
  );;
};

export default JobPage;
