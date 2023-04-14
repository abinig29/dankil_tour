import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import Review from "../Component/Review";

import { useAuthContext } from "../customHook/useAuthContext";
import useFetch from "../customHook/useFetch";

const url = "http://localhost:8000/data";
const ReviewsPage = () => {
  const history = useHistory();
  const { id } = useParams();
  const [comment, setComment] = useState();
  const [agree, setAgree] = useState(false);
  const [fucking, setFucking] = useState(false);
  const [sucessText, setSucessText] = useState("");
  const [numStar, setNumStar] = useState(0);
  const packageid = id;
  const rateStars = Array(5).fill(0);
  const { user } = useAuthContext();
  const { data: site } = useFetch(`http://localhost:5000/api/package/${id}`)

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setFucking(true);
      setSucessText("please check the button to continue");
      return;
    }
    const response = await fetch(
      `http://localhost:5000/api/comment
      `,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pkg: id,
          text: comment,
          rating: numStar,
        }),
      }
    );
    const response1 = await fetch(
      `http://localhost:5000/api/package/${id}
      `,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_rate: numStar,
        }),
      }
    );
    if (response1.ok) {
      setFucking(true);
      setSucessText("success fully created your review ");
      setTimeout(() => {
        history.go(-1);
      }, 2000);
    }
  };


  if (site.length == 0) {
    return <h4>no review</h4>;
  }
  return (
    <section className="bg-light">
      <div className="container py-5">
        <div className="reviews row mb-6 gap-2">
          <div className="package col-md-5 shadow">
            <div className="image">
              <img src={site.image[0]} alt="" className="img-fluid" />
            </div>
            <div className="packageDescription">
              <h1>{site.name} </h1>
            </div>
          </div>

          <div className="review col-md-5 ms-5 text-start">
            <form onSubmit={handelSubmit} className="reviewForm">
              <div>
                <h6>RATE YOUR EXPERIANCE</h6>
                <div className="star">
                  {rateStars.map((_, index) => {
                    return (
                      <FaStar
                        size={24}
                        style={{ marginRight: 10, cursor: "pointer" }}
                        color={numStar > index ? "orange" : "gray"}
                        key={index}
                        onClick={() => setNumStar(index + 1)}
                      />
                    );
                  })}
                </div>
              </div>

              <label className="writelable d-block" htmlFor="reviewArea">
                WRITE YOUR REVIEW
              </label>
              <textarea
                name="message"
                cols="60"
                rows="10"
                placeholder="Enter your reviews"
                id="reviewArea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <label htmlFor="agree">
                <input
                  id="agree"
                  type="checkbox"
                  onClick={(e) => {
                    setAgree(!agree);
                  }}
                />
                <span className="fw-bold">
                  I certify that this review is based on my own experience and is
                  my genuine opinion.
                </span>
              </label>
              <input
                type="submit"
                value="Post Review"
                className="btn btn-secondary btn-sl d-block mb-4"
              />
              {fucking && (
                <span className="bg-danger p-2 rounded text-light d-inline my-3">
                  {sucessText}
                </span>
              )}
            </form>
          </div>
        </div>
        <div className="otherReviews mt-5">
          <h3 className="recent text-decorations-underline">RECENT REVIEWS BY OTHERS</h3>
          <Review unique={site._id} />
        </div>
      </div>
    </section>
  );
};

export default ReviewsPage;
