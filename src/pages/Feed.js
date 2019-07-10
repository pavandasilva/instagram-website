import React, { Component } from "react";
import io from "socket.io-client";
import "./Feed.css";
import more from "../assets/more.svg";
import like from "../assets/like.svg";
import comment from "../assets/comment.svg";
import send from "../assets/send.svg";
import api from "../services/api";

class Feed extends Component {
  state = {
    feed: []
  };

  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get("posts");

    this.setState({
      feed: response.data
    });
  }

  registerToSocket = () => {
    const socket = io("http://localhost:3000");

    socket.on("post", newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on("like", likePost => {
      this.setState({
        feed: this.state.feed.map(post => {
          return post._id === likePost._id ? likePost : post;
        })
      });
    });
  };

  handleLike = id => {
    api.post(`/posts/${id}/like`);
  };

  render() {
    return (
      <section id="post-list">
        {this.state.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place} </span>
              </div>

              <img src={more} alt="Mais" />
            </header>
            <img
              className="post-image"
              src={post.image}
              alt={post.description}
            />

            <footer>
              <div className="actions">
                <button type="button" onClick={() => this.handleLike(post._id)}>
                  <img src={like} alt="Mais" />
                </button>
                <img src={comment} alt="Mais" />
                <img src={send} alt="Mais" />
              </div>
              <strong>{post.likes} curtidas</strong>
              <p>{post.descricao}</p>
              <span>{post.hashtags}</span>
            </footer>
          </article>
        ))}
      </section>
    );
  }
}

export default Feed;
