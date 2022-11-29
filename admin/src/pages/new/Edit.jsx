import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";

import "filepond/dist/filepond.min.css";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
// Register the plugin
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Col, Form, Row } from "react-bootstrap";
import axios from "./../../hooks/axios";
import { useParams } from "react-router-dom";
import { notice } from "../../hooks/toast.js";
// Register the plugins
registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginImageValidateSize,
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginImageResize
);

const Edit = ({ title }) => {
  // const [files, setFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [colorRed, setColorRed] = useState(false);
  const [colorBlue, setColorBlue] = useState(false);
  const [colorBlack, setColorBlack] = useState(false);
  const [colorWhite, setColorWhite] = useState(false);
  const [colorYellow, setColorYellow] = useState(false);
  const [sizeS, setSizeS] = useState(false);
  const [sizeM, setSizeM] = useState(false);
  const [sizeL, setSizeL] = useState(false);
  const [sizeXL, setSizeXL] = useState(false);
  const [sizeXXL, setSizeXXL] = useState(false);
  const [description, setDescription] = useState("");

  const { id } = useParams();
  useEffect(() => {
    function checkBoxLimit() {
      var checkBoxGroup = document.forms["form_name"]["color"];
      var limit = 3;
      for (var i = 0; i < checkBoxGroup.length; i++) {
        checkBoxGroup[i].onclick = function () {
          var checkedcount = 0;
          for (var i = 0; i < checkBoxGroup.length; i++) {
            checkedcount += checkBoxGroup[i].checked ? 1 : 0;
          }
          if (checkedcount > limit) {
            console.log("You can select maximum of " + limit + " color.");
            alert("You can select maximum of " + limit + " color.");
            this.checked = false;
          }
        };
      }
    }
    checkBoxLimit();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/products/${id}`);
      setName(data.name);
      setPrice(data.price);
      setColorRed(data.color.includes("red"));
      setColorBlue(data.color.includes("blue"));
      setColorBlack(data.color.includes("black"));
      setColorWhite(data.color.includes("white"));
      setColorYellow(data.color.includes("yellow"));
      setSizeS(data.size.includes("S"));
      setSizeM(data.size.includes("M"));
      setSizeL(data.size.includes("L"));
      setSizeXL(data.size.includes("XL"));
      setSizeXXL(data.size.includes("XXL"));
      setDescription(data.description);
      setFiles(data.imgPath);
    };
    fetchData();
  }, [id]);

  const setColor = () => {
    var color = [];
    if (colorRed) {
      color.push("red");
    }
    if (colorBlue) {
      color.push("blue");
    }
    if (colorBlack) {
      color.push("black");
    }
    if (colorWhite) {
      color.push("white");
    }
    if (colorYellow) {
      color.push("yellow");
    }
    return color;
  };
  const setSize = () => {
    var size = [];
    if (sizeS) {
      size.push("S");
    }
    if (sizeM) {
      size.push("M");
    }
    if (sizeL) {
      size.push("L");
    }
    if (sizeXL) {
      size.push("XL");
    }
    if (sizeXXL) {
      size.push("XXL");
    }
    return size;
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const img = getImageData(files);
      const {data} = await axios.put(`/products/${id}`, {
        name,
        price,
        color: setColor(),
        size: setSize(),
        description,
        img: img,
      });
      console.log("🚀 ~ file: Edit.jsx ~ line 143 ~ handleSubmit ~ rs", data)
      if(data._id)
      {
        notice("success", "Update successful", 2000);
      }
      else
      {
        notice("error", "Update failed", 2000);
      }
      
    } catch (error) {
      notice("error", "Wrong something", 2000);
      console.log(error);
    }
  };
  const getImageData = (files) => {
    let rs = [];
    files.forEach((item) => {
     
        var imgData = `{"type":"${item.fileType.split(";")[0]}","data":"${item.getFileEncodeBase64String()}"}`

        rs.push(imgData);
    })
    return rs
}
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <Form
            onSubmit={handleSubmit}
            name="form_name"
            id="form_name"
            style={{ width: "100%" }}
          >
            <Row>
              <Col md={6}>
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  id="name"
                  style={{ minWidth: "500px" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <br />
                <label htmlFor="price" id="price">
                  Price
                </label>
                <br />
                <input
                  type="text"
                  name="price"
                  style={{ minWidth: "500px" }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <br />
                <label>Color (Choose base on order of img) </label>
                <br />
                <input
                  type="checkbox"
                  id="red"
                  name="color"
                  value="red"
                  checked={colorRed}
                  onChange={(e) => setColorRed(e.target.checked)}
                />
                <label htmlFor="red" style={{ color: "red" }}>
                  Red
                </label>
                <br />
                <input
                  type="checkbox"
                  id="blue"
                  name="color"
                  value="blue"
                  checked={colorBlue}
                  onChange={(e) => setColorBlue(e.target.checked)}
                />
                <label htmlFor="blue" style={{ color: "blue" }}>
                  Blue
                </label>
                <br />
                <input
                  type="checkbox"
                  id="black"
                  name="color"
                  value="black"
                  checked={colorBlack}
                  onChange={(e) => setColorBlack(e.target.checked)}
                />
                <label htmlFor="black" style={{ color: "black" }}>
                  Black
                </label>
                <br />
                <input
                  type="checkbox"
                  id="white"
                  name="color"
                  value="white"
                  checked={colorWhite}
                  onChange={(e) => setColorWhite(e.target.checked)}
                />
                <label
                  htmlFor="white"
                  style={{ color: "white", textShadow: "1px 1px #000" }}
                >
                  White
                </label>
                <br />
                <input
                  type="checkbox"
                  id="yellow"
                  name="color"
                  value="yellow"
                  checked={colorYellow}
                  onChange={(e) => setColorYellow(e.target.checked)}
                />
                <label
                  htmlFor="yellow"
                  style={{ color: "yellow", textShadow: "1px 1px #000" }}
                >
                  Yellow
                </label>
                <br />
                <label>Size</label>
                <br />
                <input
                  type="checkbox"
                  id="S"
                  name="size"
                  value="S"
                  checked={sizeS}
                  onChange={(e) => setSizeS(e.target.checked)}
                />
                <label htmlFor="S">S</label>
                <br />
                <input
                  type="checkbox"
                  id="M"
                  name="size"
                  value="M"
                  checked={sizeM}
                  onChange={(e) => setSizeM(e.target.checked)}
                />
                <label htmlFor="M">M</label>
                <br />
                <input
                  type="checkbox"
                  id="L"
                  name="size"
                  value="L"
                  checked={sizeL}
                  onChange={(e) => setSizeL(e.target.checked)}
                />
                <label htmlFor="L">L</label>
                <br />
                <input
                  type="checkbox"
                  id="XL"
                  name="size"
                  value="XL"
                  checked={sizeXL}
                  onChange={(e) => setSizeXL(e.target.checked)}
                />
                <label htmlFor="XL">XL</label>
                <br />
                <input
                  type="checkbox"
                  id="XXL"
                  name="size"
                  value="XXL"
                  checked={sizeXXL}
                  onChange={(e) => setSizeXXL(e.target.checked)}
                />
                <label htmlFor="XXL">XXL</label>
                <br />
                <label htmlFor="description" id="description">
                  Description
                </label>
                <br />
                <textarea
                  type="text"
                  name="description"
                  style={{ height: "100px", minWidth: "500px" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <FilePond
                  className="NGUYENVANAN"
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  maxFiles={3}
                  maxFileSize="3MB"
                  //server="/api"
                  name="img"
                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />
                <input type="submit" value="Edit Product" />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Edit;