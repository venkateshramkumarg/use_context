"use client";
import React, { createContext, useState, useEffect } from "react";

interface LoginHistory {
  device: string;
  location: string;
  date: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface PrivacySettings {
  profileVisibility: string;
  activityStatus: boolean;
}

interface Settings {
  theme: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

interface Security {
  twoFactorAuth: boolean;
  lastLogin: string;
  loginHistory: LoginHistory[];
}

interface CommunicationPreferences {
  newsletter: boolean;
  promotionalEmails: boolean;
  smsAlerts: boolean;
}

interface Preferences {
  currency: string;
  timezone: string;
  communication: CommunicationPreferences;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: any[];
}

interface PurchaseItem {
  name: string;
  quantity: number;
  price: number;
}

interface Purchase {
  id: string;
  items: PurchaseItem[];
  totalAmount: number;
  purchaseDate: string;
  deliveryStatus: string;
}

interface Friend {
  id: string;
  name: string;
  mutualFriends: number;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  settings: Settings;
  security: Security;
  preferences: Preferences;
  activity: {
    posts: Post[];
    purchases: Purchase[];
  };
  friends: Friend[];
}

interface ProfileContextProps {
  profile: Profile | null;
  updateProfile: (updatedProfile: Profile) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextProps | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/api/profile");
      const data = await response.json();
      setProfile(data.user);
    };
    fetchProfile();
  }, []);

  const updateProfile = async (updatedProfile: Profile) => {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: updatedProfile }),
    });

    if (response.ok) {
      setProfile(updatedProfile);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
