import React from "react";
import { useState, useRef, useEffect } from "react";
import { BsEnvelopeAt, BsShieldLock } from "react-icons/bs";
import { BiUserPin } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

function SignUpHospital() {
  const {eth_id} = useAuth();
  const {setAuth} = useAuth();
  const inputref_ph_no = useRef(null);
  const navigate = useNavigate();
  const [HospitalId, setHospitalId] = useState("");
  const [Username, setUsername] = useState("");
  const [ph_no, setph_no] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setotpSent] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const displayStatement = () =>{
    const ele = document.getElementById("alert-valid");
    ele.classList.remove("alert-valid-false");
    ele.classList.add("alert-valid-true");
  }
  const displayError = () =>{
    const ele = document.getElementById("alert-valid");
    ele.classList.remove("alert-valid-true");
    ele.classList.add("alert-valid-false");
  }
  const requestingOtp = async () => {
    console.log("asdf");
    console.log(ph_no);
    console.log(eth_id);
    await axiosPrivate
      .post("/api/login", {
        mobile: ph_no,
        eth_id: eth_id,
      })
      .then((res) => {
        console.log(res);
        if (res.data.resultCode === "00048") {
          displayStatement();
          setotpSent("Otp Sent");
        }
      })
      .catch((err) => {
        console.log(err);
        setotpSent("Invalid Number");
        displayError();
        navigate("/Hospital/Login")
      });
  };
  const Data = async (event) => {
    console.log("clicked Data");
    await axiosPrivate
      .post("/api/verify-mobile", {
        eth_id: eth_id,
        mobile: ph_no,
        code: password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.resultCode === "00035") {
          displayStatement();
          setotpSent("Otp Verified");
        }
      })
      .catch((err) => {
        setotpSent("Invalid OTP");
        displayError()
        navigate("/Hospital/Login")
      });
    return false;
  };

  const Loginto = async () => {
    console.log("clicked Login");
    console.log(Username);
    console.log(HospitalId);
    console.log(ph_no);
    console.log(eth_id);

    await axiosPrivate
      .post("/api/hospital/register", {
        eth_id: eth_id,
        name: Username,
        mobile: ph_no,
        registrationId : HospitalId
      })
      .then((res) => {
        if (res) {
          const accessToken = res.data.accessToken ;
          setAuth({Username,HospitalId,eth_id,ph_no,accessToken});
          navigate("/Hospital/Home");
        }
      })
      .catch((err) => {
        setotpSent("Invalid OTP");
        displayError();
        console.log(err);
        navigate("/Hospital/Login")
      });
    return false;
  };
  useEffect(() => {
    inputref_ph_no.current.focus();
  }, []);

  return (
    <form action="#" className="sign-up-form">
      <h2 className="title">Sign up</h2>
      <div className="input-field">
        <BiUserPin
          className="input-field-icons"
          style={{ marginLeft: "10px" }}
        />
        <input
          type="text"
          placeholder="Name"
          value={Username}
          ref={inputref_ph_no}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div className="input-field">
        <BiUserPin
          className="input-field-icons"
          style={{ marginLeft: "10px" }}
        />
        <input
          type="text"
          placeholder="Enter your Registration ID"
          value={HospitalId}
          onChange={(e) => {
            setHospitalId(e.target.value);
          }}
        />
      </div>
      <div className="input-field">
        <BsShieldLock
          className="input-field-icons"
          style={{ marginLeft: "10px" }}
        />
        <input
          type="text"
          placeholder="Enter phone no"
          value={ph_no}
          onChange={(e) => {
            setph_no(e.target.value);
          }}
        />
        <button className="send-otp-btn" onClick={requestingOtp}>
          Send OTP
        </button>
      </div>
      <div className="input-field">
        <BsShieldLock
          className="input-field-icons"
          style={{ marginLeft: "10px" }}
        />
        <input
          type="password"
          placeholder="Enter your OTP"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button className="OTP-verify-btn send-otp-btn" onClick={Data}>
          Confirm OTP
        </button>
      </div>
      <input type="submit" className="btn" value="Sign up" onClick={Loginto} />
      <div id="alert-valid" className="alert-valid">{`*${otpSent}`}</div>
      {/* <div id="alert-valid-otp">{`${Confirmotp}`}</div> */}
    </form>
  );
}
export default SignUpHospital;
