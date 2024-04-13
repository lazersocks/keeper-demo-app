import React, { useState, useEffect, useRef } from "react";
import eb from "@src/eb";

function Header() {
  const [userImage, setUserImage] = useState("");
  const imageRef = useRef(null);
  const auth = eb.auth.isAuthenticated();
  useEffect(() => {
    // Assuming you might fetch the user's image URL from local storage or a server
    async function fetchImage() {
      try {
        // Assuming you might fetch the user's image URL from local storage or a server
        const res = await eb.db.readRecord("userAvatar", {
          user: eb.auth.currentUser(),
        });
        console.log("res in fetch", res);
        const image_id = res.data.image_id;
        console.log("image_id", image_id);
        const image = await eb.files.getFileUrl(image_id);
        console.log("image", image);
        // If res.data contains the URL of the image
        setUserImage(image.data);
      } catch (error) {
        console.error("Failed to fetch image:", error);
        // Handle error here
      }
    }
    if (auth) {
      fetchImage();
    }
  }, []);

  const handleContextMenu = (event) => {
    event.preventDefault();
    const menu = new window.remote.Menu.buildFromTemplate([
      {
        label: userImage ? "Remove Image" : "Add Image",
        click: () => {
          if (userImage) {
            removeImage();
          } else {
            addImage();
          }
        },
      },
    ]);
    menu.popup({ window: window.remote.getCurrentWindow() });
  };

  const handleLogout = () => {
    // This function would trigger the file input to upload an image or open a dialog to choose an image
    // For example, using an input element with type="file"
    // imageRef.current.click();
    eb.auth.signOut();
    window.location.reload();
  };

  const removeImage = () => {
    localStorage.removeItem("userImage");
    setUserImage(null);
  };

  const handleImageChange = async (event) => {
    if (!auth) {
      return;
    }
    try {
      console.log("here");
      const file = event.target.files[0];
      if (file) {
        const res = await eb.files.uploadFile(file);
        console.log("File uploaded", res);
        const createAvatar = await eb.db.updateRecord(
          "userAvatar",
          {
            user: eb.auth.currentUser(),
          },
          {
            image_id: res.data,
            user: eb.auth.currentUser(),
          },
          { upsert: true }
        );
        console.log(res);
        const image = await eb.files.getFileUrl(res.data);
        setUserImage(image.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px", // Added some padding
    }}
  >
    <h1>Keeper</h1>
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {auth && (
        <>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              overflow: "hidden",
              marginRight: "10px", // Add space between image and logout button
            }}
          >
            <img
              ref={imageRef}
              src={userImage || "path/to/default/avatar.png"} // Add a default image path
              alt="User avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onClick={() => imageRef.current && imageRef.current.click()} // Trigger file input when image is clicked
            />
            <input
              type="file"
              ref={imageRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
            Logout
          </button>
        </>
      )}
    </div>
  </header>
    // <header
    //   style={{
    //     display: "flex",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    //   }}
    // >
    //   <h1>Keeper</h1>
    //   <div
    //     style={{
    //       display: "flex",
    //       alignItems: "center",
    //     }}
    //   >
    //     {auth && (
    //       <div
    //         style={{
    //           width: "50px",
    //           height: "50px",
    //           borderRadius: "50%",
    //           overflow: "hidden",
    //         }}
    //       >
    //         <img
    //           ref={imageRef}
    //           src={userImage}
    //           alt="User avatar"
    //           style={{ width: "100%", height: "100%", objectFit: "cover" }}
    //         />
    //         <input
    //           type="file"
    //           ref={imageRef}
    //           onChange={handleImageChange}
    //           style={{ display: "none" }}
    //         />

    //         <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
    //           Logout
    //         </button>
    //         {/* Hidden file input */}
 
    //       </div>
    //     )}
    //   </div>
    // </header>
  );
}

export default Header;
