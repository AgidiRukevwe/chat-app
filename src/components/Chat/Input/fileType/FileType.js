import React from "react";
import "./fileType.css";

import ImageIcon from "@material-ui/icons/Image";
import DescriptionIcon from "@material-ui/icons/Description";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import VideocamIcon from "@material-ui/icons/Videocam";

function FileType() {
    return (
        <div className="fileType">
            <ImageIcon className="fileType__icon --image" />
            <DescriptionIcon className="fileType__icon --document" />
            <MusicNoteIcon className="fileType__icon --music" />
            <VideocamIcon className="fileType__icon --video" />
        </div>
    );
}

export default FileType;
