import React, { useState } from "react";

const ApproveStudent = () => {
  const [status] = useState(["pending", "approved", "rejected"]);
  
  return (
    <div>
      <h1>Here you can approve student profile</h1>
    </div>
  );
};

export default ApproveStudent;
