import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CmsService from "../../../services/cms";
import { useStateIfMounted } from "use-state-if-mounted";

export default function BlogDetails() {
  let publicUrl = process.env.REACT_APP_PUBLIC_URL + "/";

  const [blog, setBlog] = useStateIfMounted({});
  const params = useParams();

  const loadBlog = async () => {
    const formResponse = await CmsService.detail(params.id);
    setBlog(formResponse);
  };

  useEffect(() => {
    loadBlog();
  }, []);

  return (
    <div className="ltn__page-details-area ltn__blog-details-area mb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__blog-details-wrap">
              <div className="ltn__page-details-inner ltn__blog-details-inner">
                <div className="ltn__blog-meta">
                  <div className="ltn__blog-img">
                    <img
                      src={
                        process.env.REACT_APP_API_URL +
                        "/" +
                        blog.featuredImageFile
                      }
                      alt="#"
                    />
                  </div>
                </div>
                <h2 className="ltn__blog-title">{blog.title}</h2>
                <div className="ltn__blog-meta">
                  <ul>
                    <li className="ltn__blog-author go-top">
                      <img
                        src={publicUrl + "assets/img/blog/author.jpg"}
                        alt="#"
                      />
                      By: Admin
                    </li>
                    <li className="ltn__blog-date">
                      <i className="far fa-calendar-alt" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
                <p dangerouslySetInnerHTML={{ __html: blog.description }} />
                {blog?.file && (
                  <div className="row">
                    <a
                      href={process.env.REACT_APP_API_URL + "/" + blog.file}
                      target="blank"
                      className="btn theme-btn-1 mb-3 w-25"
                    >
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
