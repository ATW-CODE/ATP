import React from "react";
import PayButton from "./PayButton";

export default function PrintJobs({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return <p>No print jobs yet.</p>;
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>My Print Jobs</h3>

      <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Pages</th>
            <th>Copies</th>
            <th>Color</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.status}</td>
              <td>{job.pages}</td>
              <td>{job.copies}</td>
              <td>{job.color ? "Yes" : "No"}</td>
              <td>₹{job.cost}</td>
              <td>
                {job.payment_status !== "paid" ? (
                  <PayButton printJobId={job.id} />
                ) : (
                  "Paid"
                )}
              </td>
              <td>{new Date(job.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
