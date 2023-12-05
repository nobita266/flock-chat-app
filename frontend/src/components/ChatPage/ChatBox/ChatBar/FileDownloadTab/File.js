import { FaEye } from "react-icons/fa";
import { fetchPreSignedGetUrl } from "api/AWS/fileData";
import { useSelector } from "react-redux";
import { getAccessToken } from "helpers/selectors";
import "./File.css";
import { useState } from "react";
import { Loader } from "utils/Loader/Loader";

const File = ({ uploadedFile }) => {
  const { fileName, contentType } = uploadedFile;
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector(getAccessToken);
  const handleClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetchPreSignedGetUrl({ fileName, accessToken });
      const preSignedGETUrl = await res.json();
      window.open(preSignedGETUrl, "_blank");
    } catch (error) {
      alert(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div onClick={handleClick} className="tab">
          <div className="tab-content">
            <span className="tab-text">{fileName}</span>
            <span className="contentType">{contentType}</span>
          </div>
          {<FaEye />}
        </div>
      )}
    </>
  );
};

export default File;
