import ezbase from "ezbase-ts";
// import ezbase from "../../../p06-Opensource_Backend_In_Rust/Development/Sprint-4/sdk/dist/index";

const eb = new ezbase(`http://localhost:3690`, `http://localhost:3691`);
export default eb