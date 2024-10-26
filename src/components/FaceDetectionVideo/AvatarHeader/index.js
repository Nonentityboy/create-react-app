import React from 'react';
import './index.css';

function AvatarHeader({ user, audienceCount, audienceAvatars }) {
    return (
        <div className="avatar-header">
            <div className="user-info">
                <img src={user.avatar} alt="User Avatar" className="user-avatar" />
                <div className="user-details">
                    <span className="user-name">{user.name}</span>
                    <span className="user-id">@{user.id}</span>
                </div>
                <div className="like-icon">❤️</div>
            </div>
            <div className="audience-info">
                {audienceAvatars.slice(0, 3).map((avatar, index) => (
                    <img key={index} src={avatar} alt="Audience Avatar" className="audience-avatar" />
                ))}
                <div className="audience-count">{audienceCount}+人</div>
            </div>
        </div>
    );
}

export default AvatarHeader;

