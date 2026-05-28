import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  Droplets,
  Guitar,
  Headphones,
  Heart,
  MapPin,
  Mic2,
  Music,
  Music2,
  Piano,
  RefreshCw,
  Sparkles,
  Star,
  Sun,
  Wind,
  Zap,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const WENSHAN = { name: "台北市 文山區", latitude: 24.9886, longitude: 121.5698 };

const genres = [
  "All",
  "Indie / 文青",
  "Lo-fi / Chill",
  "華語流行",
  "英文流行",
  "R&B 靈魂",
  "嘻哈",
  "搖滾",
  "Jazz",
  "夜晚感",
  "Emo",
  "Acoustic / 民謠",
];
const moods = ["平靜", "放鬆", "開心", "難過", "疲憊", "無感", "暴躁", "焦慮"];

const weatherCodeMap = {
  0: "晴朗",
  1: "大致晴朗",
  2: "多雲時晴",
  3: "多雲時陰",
  45: "有霧",
  48: "有霧",
  51: "小毛毛雨",
  53: "毛毛雨",
  55: "大毛毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  80: "短暫陣雨",
  81: "陣雨",
  82: "強陣雨",
  95: "雷雨",
};

const moodCaptions = {
  平靜: "今天不用急著奔跑，慢慢聽也很好。",
  放鬆: "讓聲音變得柔軟，替你把日子放慢。",
  開心: "適合把音量調高一點，讓心情往外擴散。",
  難過: "有些歌不是為了振作，是為了陪你待一會。",
  疲憊: "今天已經夠努力了，剩下的交給音樂。",
  無感: "有時候不是快樂或悲傷，只是靜靜地經過一天。",
  暴躁: "讓那些快爆炸的情緒，被聲音慢慢吸收。",
  焦慮: "不用立刻把自己整理好，先讓呼吸慢下來。",
};

const genreAliases = {
  "Indie / 文青": ["Indie"],
  "Lo-fi / Chill": ["Lo-fi"],
  "華語流行": ["Mandopop"],
  "英文流行": ["Pop"],
  "R&B 靈魂": ["R&B"],
  嘻哈: ["Hip Hop"],
  搖滾: ["Rock"],
  Jazz: ["Jazz"],
  夜晚感: ["Lo-fi", "R&B", "Indie"],
  Emo: ["Rock", "Indie", "Mandopop"],
  "Acoustic / 民謠": ["Acoustic", "Indie", "Mandopop"],
};

function comboHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) % 9973;
  return hash;
}

function musicSearchUrl(song) {
  return `https://music.apple.com/search?term=${encodeURIComponent(`${song.title} ${song.artist}`)}`;
}

const songLibrary = [
  { title: "The Night We Met", artist: "Lord Huron", lang: "EN", genres: ["Indie", "Acoustic"], moods: ["平靜", "難過", "無感", "焦慮"], weather: ["cloudy", "rainy"], duration: "03:28" },
  { title: "好不容易", artist: "告五人", lang: "中文", genres: ["Mandopop", "Indie"], moods: ["難過", "疲憊", "無感"], weather: ["cloudy", "rainy"], duration: "04:32" },
  { title: "I Like Me Better", artist: "Lauv", lang: "EN", genres: ["Pop"], moods: ["開心", "放鬆"], weather: ["sunny", "cloudy"], duration: "03:17" },
  { title: "Coffee", artist: "beabadoobee", lang: "EN", genres: ["Indie", "Lo-fi"], moods: ["放鬆", "疲憊", "焦慮"], weather: ["rainy", "cloudy"], duration: "02:15" },
  { title: "Best Part", artist: "Daniel Caesar ft. H.E.R.", lang: "EN", genres: ["R&B"], moods: ["平靜", "放鬆"], weather: ["sunny", "cloudy", "rainy"], duration: "03:29" },
  { title: "Sweet Disposition", artist: "The Temper Trap", lang: "EN", genres: ["Rock", "Indie"], moods: ["開心", "放鬆"], weather: ["sunny", "cloudy"], duration: "03:54" },
  { title: "Lost Stars", artist: "Adam Levine", lang: "EN", genres: ["Pop"], moods: ["難過", "無感"], weather: ["cloudy", "rainy"], duration: "04:27" },
  { title: "Afterglow", artist: "Men I Trust", lang: "EN", genres: ["Indie", "Lo-fi"], moods: ["平靜", "無感"], weather: ["cloudy", "rainy"], duration: "03:48" },
  { title: "Lover Boy 88", artist: "Phum Viphurit", lang: "EN", genres: ["Indie", "Pop"], moods: ["開心", "暴躁"], weather: ["sunny"], duration: "03:39" },
  { title: "Misty", artist: "Erroll Garner", lang: "EN", genres: ["Jazz"], moods: ["平靜", "疲憊"], weather: ["rainy", "cloudy"], duration: "02:55" },
  { title: "慢冷", artist: "梁靜茹", lang: "中文", genres: ["Mandopop"], moods: ["難過", "無感"], weather: ["rainy", "cloudy"], duration: "04:23" },
  { title: "若把你", artist: "Kirsty劉瑾睿", lang: "中文", genres: ["Mandopop", "R&B"], moods: ["放鬆", "平靜"], weather: ["sunny", "cloudy"], duration: "03:40" },
  { title: "不為誰而作的歌", artist: "林俊傑", lang: "中文", genres: ["Mandopop", "Pop"], moods: ["疲憊", "難過"], weather: ["rainy", "cloudy"], duration: "04:26" },
  { title: "大風吹", artist: "草東沒有派對", lang: "中文", genres: ["Rock", "Indie"], moods: ["疲憊", "暴躁"], weather: ["cloudy", "rainy"], duration: "05:25" },
  { title: "Fly Me to the Moon", artist: "Frank Sinatra", lang: "EN", genres: ["Jazz"], moods: ["放鬆", "開心"], weather: ["sunny", "cloudy"], duration: "02:28" },
  { title: "Pink + White", artist: "Frank Ocean", lang: "EN", genres: ["R&B"], moods: ["平靜", "無感"], weather: ["sunny", "cloudy"], duration: "03:04" },
  { title: "See You Again", artist: "Tyler, The Creator ft. Kali Uchis", lang: "EN", genres: ["Hip Hop", "R&B"], moods: ["開心", "暴躁"], weather: ["sunny"], duration: "03:00" },
  { title: "Bad Habit", artist: "Steve Lacy", lang: "EN", genres: ["R&B", "Indie"], moods: ["無感", "暴躁"], weather: ["sunny", "cloudy"], duration: "03:52" },
  { title: "505", artist: "Arctic Monkeys", lang: "EN", genres: ["Rock", "Indie"], moods: ["難過", "暴躁"], weather: ["cloudy", "rainy"], duration: "04:13" },
  { title: "Blue in Green", artist: "Miles Davis", lang: "EN", genres: ["Jazz"], moods: ["平靜", "無感"], weather: ["rainy", "cloudy"], duration: "05:37" },
  { title: "夜空中最亮的星", artist: "逃跑計劃", lang: "中文", genres: ["Rock", "Mandopop"], moods: ["開心", "疲憊"], weather: ["sunny", "cloudy"], duration: "04:12" },
  { title: "愛人錯過", artist: "告五人", lang: "中文", genres: ["Mandopop", "Indie"], moods: ["開心", "暴躁"], weather: ["sunny", "cloudy"], duration: "04:52" },
  { title: "想見你想見你想見你", artist: "八三夭", lang: "中文", genres: ["Mandopop", "Rock"], moods: ["開心", "難過"], weather: ["sunny", "cloudy"], duration: "04:00" },
  { title: "水星記", artist: "郭頂", lang: "中文", genres: ["Mandopop", "R&B"], moods: ["平靜", "無感", "難過", "焦慮"], weather: ["cloudy", "rainy"], duration: "05:25" },
  { title: "Self Control", artist: "Frank Ocean", lang: "EN", genres: ["R&B"], moods: ["難過", "疲憊", "焦慮"], weather: ["rainy", "cloudy"], duration: "04:09" },
  { title: "Nujabes - Feather", artist: "Nujabes", lang: "EN", genres: ["Hip Hop", "Lo-fi"], moods: ["平靜", "放鬆"], weather: ["sunny", "cloudy"], duration: "02:55" },
  { title: "Space Song", artist: "Beach House", lang: "EN", genres: ["Indie"], moods: ["平靜", "無感", "難過"], weather: ["cloudy", "rainy"], duration: "05:20" },
  { title: "First Love", artist: "宇多田光", lang: "中文", genres: ["Pop", "R&B"], moods: ["難過", "平靜"], weather: ["rainy", "cloudy"], duration: "04:17" },
  { title: "Can I Call You Tonight?", artist: "Dayglow", lang: "EN", genres: ["Indie", "Pop"], moods: ["開心", "放鬆"], weather: ["sunny", "cloudy"], duration: "04:38" },
  { title: "都會感", artist: "YELLOW黃宣", lang: "中文", genres: ["R&B", "Mandopop"], moods: ["開心", "無感"], weather: ["sunny", "cloudy"], duration: "03:32" },
  { title: "Snooze", artist: "SZA", lang: "EN", genres: ["R&B"], moods: ["放鬆", "疲憊"], weather: ["rainy", "cloudy"], duration: "03:21" },
  { title: "Sunflower", artist: "Rex Orange County", lang: "EN", genres: ["Indie", "Pop"], moods: ["開心", "放鬆"], weather: ["sunny"], duration: "04:12" },
  { title: "一派輕鬆", artist: "deca joins", lang: "中文", genres: ["Indie", "Mandopop"], moods: ["放鬆", "無感"], weather: ["sunny", "cloudy"], duration: "04:08" },
  { title: "Japanese Denim", artist: "Daniel Caesar", lang: "EN", genres: ["R&B"], moods: ["平靜", "難過"], weather: ["rainy", "cloudy"], duration: "04:30" },
  { title: "Put Your Records On", artist: "Corinne Bailey Rae", lang: "EN", genres: ["Pop", "R&B"], moods: ["開心", "放鬆"], weather: ["sunny"], duration: "03:35" },
  { title: "山海", artist: "草東沒有派對", lang: "中文", genres: ["Rock", "Indie"], moods: ["暴躁", "難過"], weather: ["cloudy", "rainy"], duration: "04:48" },
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys", lang: "EN", genres: ["Rock"], moods: ["暴躁", "無感"], weather: ["cloudy", "rainy"], duration: "04:32" },
  { title: "Last Nite", artist: "The Strokes", lang: "EN", genres: ["Rock", "Indie"], moods: ["開心", "暴躁"], weather: ["sunny", "cloudy"], duration: "03:13" },
  { title: "披星戴月的想你", artist: "告五人", lang: "中文", genres: ["Indie", "Mandopop"], moods: ["開心", "難過"], weather: ["sunny", "cloudy"], duration: "04:31" },
  { title: "夜長夢少", artist: "傻子與白痴", lang: "中文", genres: ["Indie", "Jazz", "Mandopop"], moods: ["平靜", "無感", "焦慮"], weather: ["cloudy", "rainy"], duration: "04:43" },
  { title: "Everybody Loves The Sunshine", artist: "Roy Ayers Ubiquity", lang: "EN", genres: ["Jazz", "R&B"], moods: ["放鬆", "開心"], weather: ["sunny"], duration: "03:59" },
  { title: "Take Five", artist: "The Dave Brubeck Quartet", lang: "EN", genres: ["Jazz"], moods: ["平靜", "放鬆", "無感"], weather: ["sunny", "cloudy"], duration: "05:24" },
  { title: "My Favorite Things", artist: "John Coltrane", lang: "EN", genres: ["Jazz"], moods: ["開心", "暴躁"], weather: ["rainy", "cloudy"], duration: "13:44" },
  { title: "Breezin'", artist: "George Benson", lang: "EN", genres: ["Jazz", "R&B"], moods: ["放鬆", "平靜"], weather: ["sunny", "cloudy"], duration: "05:40" },
  { title: "Luv(sic) pt3", artist: "Nujabes ft. Shing02", lang: "EN", genres: ["Hip Hop", "Lo-fi"], moods: ["平靜", "難過"], weather: ["rainy", "cloudy"], duration: "05:36" },
  { title: "BLEACH", artist: "BROCKHAMPTON", lang: "EN", genres: ["Hip Hop", "R&B"], moods: ["無感", "疲憊"], weather: ["cloudy", "rainy"], duration: "04:33" },
  { title: "Good Days", artist: "SZA", lang: "EN", genres: ["R&B", "Lo-fi"], moods: ["平靜", "疲憊", "焦慮"], weather: ["sunny", "cloudy"], duration: "04:39" },
  { title: "EARFQUAKE", artist: "Tyler, The Creator", lang: "EN", genres: ["Hip Hop", "R&B"], moods: ["暴躁", "難過"], weather: ["cloudy", "rainy"], duration: "03:10" },
  { title: "Love Is Only a Feeling", artist: "Joey Bada$$", lang: "EN", genres: ["Hip Hop", "Lo-fi"], moods: ["放鬆", "平靜"], weather: ["sunny", "cloudy"], duration: "02:32" },
  { title: "Snowman", artist: "WYS", lang: "EN", genres: ["Lo-fi"], moods: ["平靜", "疲憊", "焦慮"], weather: ["rainy", "cloudy"], duration: "02:10" },
  { title: "Aruarian Dance", artist: "Nujabes", lang: "EN", genres: ["Lo-fi", "Hip Hop"], moods: ["放鬆", "無感"], weather: ["sunny", "cloudy"], duration: "04:11" },
  { title: "Better Together", artist: "Jack Johnson", lang: "EN", genres: ["Pop", "Indie", "Acoustic"], moods: ["放鬆", "開心"], weather: ["sunny"], duration: "03:27" },
  { title: "New Light", artist: "John Mayer", lang: "EN", genres: ["Pop", "Rock"], moods: ["開心", "無感"], weather: ["sunny", "cloudy"], duration: "03:36" },
  { title: "兜圈", artist: "林宥嘉", lang: "中文", genres: ["Mandopop", "Pop"], moods: ["難過", "疲憊"], weather: ["rainy", "cloudy"], duration: "04:27" },
  { title: "你要如何，我們就如何", artist: "康士坦的變化球", lang: "中文", genres: ["Rock", "Mandopop"], moods: ["暴躁", "疲憊"], weather: ["cloudy", "rainy"], duration: "05:21" },
  { title: "向夜晚奔去", artist: "YOASOBI", lang: "中文", genres: ["Pop"], moods: ["開心", "暴躁"], weather: ["sunny", "cloudy"], duration: "04:18" },
  { title: "不用去猜", artist: "J.Sheon", lang: "中文", genres: ["R&B", "Mandopop"], moods: ["放鬆", "無感"], weather: ["sunny", "cloudy"], duration: "03:15" },
  { title: "愛情你比我想的閣較偉大", artist: "茄子蛋", lang: "中文", genres: ["Rock", "Mandopop"], moods: ["難過", "疲憊"], weather: ["rainy", "cloudy"], duration: "05:02" },
  { title: "理想混蛋", artist: "不是因為天氣晴朗才愛你", lang: "中文", genres: ["Mandopop", "Indie"], moods: ["平靜", "放鬆"], weather: ["sunny", "cloudy"], duration: "04:20" },
  { title: "關於小熊", artist: "蛋堡", lang: "中文", genres: ["Hip Hop", "Lo-fi"], moods: ["平靜", "無感", "焦慮"], weather: ["cloudy", "rainy"], duration: "04:19" },
  { title: "收斂水", artist: "蛋堡", lang: "中文", genres: ["Hip Hop", "Lo-fi"], moods: ["放鬆", "疲憊"], weather: ["sunny", "cloudy"], duration: "04:36" },
  { title: "Rain City", artist: "wannasleep", lang: "中文", genres: ["Hip Hop", "Lo-fi"], moods: ["無感", "暴躁"], weather: ["rainy", "cloudy"], duration: "03:12" },
  { title: "SEXY NUKIM", artist: "wannasleep", lang: "中文", genres: ["Hip Hop"], moods: ["暴躁", "開心"], weather: ["sunny", "cloudy"], duration: "02:54" },
  { title: "島嶼天光", artist: "滅火器", lang: "中文", genres: ["Rock", "Mandopop"], moods: ["暴躁", "開心"], weather: ["sunny", "cloudy"], duration: "05:08" },
  { title: "晚安台灣", artist: "滅火器", lang: "中文", genres: ["Rock"], moods: ["難過", "疲憊"], weather: ["rainy", "cloudy"], duration: "04:42" },
  { title: "魚仔", artist: "盧廣仲", lang: "中文", genres: ["Mandopop", "Indie", "Acoustic"], moods: ["平靜", "放鬆"], weather: ["sunny", "cloudy"], duration: "05:10" },
  { title: "刻在我心底的名字", artist: "盧廣仲", lang: "中文", genres: ["Mandopop", "Pop"], moods: ["難過", "焦慮"], weather: ["rainy", "cloudy"], duration: "05:02" },
  { title: "勇氣", artist: "梁靜茹", lang: "中文", genres: ["Mandopop", "Pop"], moods: ["開心", "放鬆"], weather: ["sunny", "cloudy"], duration: "04:15" },
  { title: "Older", artist: "Sasha Alex Sloan", lang: "EN", genres: ["Pop", "Indie"], moods: ["疲憊", "焦慮"], weather: ["cloudy", "rainy"], duration: "03:11" },
  { title: "Dancing With Your Ghost", artist: "Sasha Alex Sloan", lang: "EN", genres: ["Pop"], moods: ["難過", "無感"], weather: ["rainy", "cloudy"], duration: "03:17" },
  { title: "Rollin' On", artist: "椅子樂團", lang: "中文", genres: ["Indie", "Lo-fi"], moods: ["放鬆", "開心"], weather: ["sunny", "cloudy"], duration: "03:44" },
  { title: "Maybe Maybe", artist: "椅子樂團", lang: "中文", genres: ["Indie"], moods: ["平靜", "無感"], weather: ["cloudy", "rainy"], duration: "04:01" },
  { title: "輕輕", artist: "陳嫻靜", lang: "中文", genres: ["R&B", "Lo-fi"], moods: ["平靜", "焦慮"], weather: ["rainy", "cloudy"], duration: "03:08" },
  { title: "如果每天都可以 happy happy 誰想要sad", artist: "陳嫻靜", lang: "中文", genres: ["Hip Hop", "R&B"], moods: ["無感", "暴躁"], weather: ["cloudy", "rainy"], duration: "03:26" },
  { title: "城南", artist: "正興", lang: "中文", genres: ["Indie", "Mandopop"], moods: ["平靜", "放鬆"], weather: ["sunny", "cloudy"], duration: "04:20" },
  { title: "再見", artist: "張震嶽", lang: "中文", genres: ["Mandopop", "Rock"], moods: ["難過", "疲憊"], weather: ["rainy", "cloudy"], duration: "04:36" },
  { title: "自由", artist: "張震嶽", lang: "中文", genres: ["Rock", "Mandopop", "Acoustic"], moods: ["開心", "放鬆"], weather: ["sunny"], duration: "04:11" },
  { title: "一起去跑步", artist: "宇宙人", lang: "中文", genres: ["Pop", "Indie"], moods: ["開心", "放鬆"], weather: ["sunny"], duration: "03:49" },
  { title: "那你呢", artist: "宇宙人", lang: "中文", genres: ["Mandopop", "Indie"], moods: ["無感", "平靜"], weather: ["cloudy", "rainy"], duration: "04:02" },
  { title: "Leave The Door Open", artist: "Bruno Mars, Anderson .Paak, Silk Sonic", lang: "EN", genres: ["R&B", "Pop"], moods: ["放鬆", "開心"], weather: ["sunny", "cloudy"], duration: "04:02" },
  { title: "Talking To The Moon", artist: "Bruno Mars", lang: "EN", genres: ["Pop", "R&B"], moods: ["難過", "焦慮"], weather: ["rainy", "cloudy"], duration: "03:37" },
  { title: "Ghost", artist: "Justin Bieber", lang: "EN", genres: ["Pop"], moods: ["難過", "無感"], weather: ["cloudy", "rainy"], duration: "02:33" },
  { title: "Peaches", artist: "Justin Bieber ft. Daniel Caesar", lang: "EN", genres: ["R&B", "Pop"], moods: ["開心", "放鬆"], weather: ["sunny"], duration: "03:18" },
  { title: "Attention", artist: "Charlie Puth", lang: "EN", genres: ["Pop"], moods: ["暴躁", "開心"], weather: ["sunny", "cloudy"], duration: "03:31" },
  { title: "Dangerously", artist: "Charlie Puth", lang: "EN", genres: ["Pop"], moods: ["難過", "焦慮"], weather: ["rainy", "cloudy"], duration: "03:18" },
  { title: "Day 1 ◑", artist: "HONNE", lang: "EN", genres: ["R&B", "Indie"], moods: ["放鬆", "平靜"], weather: ["sunny", "cloudy"], duration: "03:53" },
  { title: "Location Unknown", artist: "HONNE ft. BEKA", lang: "EN", genres: ["Indie", "R&B"], moods: ["無感", "焦慮"], weather: ["cloudy", "rainy"], duration: "04:01" },
  { title: "蝴蝶", artist: "事後菸樂團", lang: "中文", genres: ["Indie", "Rock"], moods: ["難過", "平靜"], weather: ["rainy", "cloudy"], duration: "04:44" },
  { title: "煙火", artist: "事後菸樂團", lang: "中文", genres: ["Indie"], moods: ["無感", "疲憊"], weather: ["cloudy", "rainy"], duration: "04:12" },
  { title: "夢裡的你", artist: "PAMI", lang: "中文", genres: ["Lo-fi", "R&B"], moods: ["平靜", "焦慮"], weather: ["rainy", "cloudy"], duration: "03:29" },
  { title: "浪漫體質", artist: "PAMI", lang: "中文", genres: ["Lo-fi", "Indie"], moods: ["放鬆", "無感"], weather: ["sunny", "cloudy"], duration: "03:11" },
  { title: "愛愛愛", artist: "方大同", lang: "中文", genres: ["R&B", "Mandopop"], moods: ["放鬆", "開心"], weather: ["sunny", "cloudy"], duration: "03:44" },
  { title: "特別的人", artist: "方大同", lang: "中文", genres: ["R&B", "Pop"], moods: ["平靜", "難過"], weather: ["cloudy", "rainy"], duration: "04:12" },
  { title: "新世紀的女兒", artist: "鄭宜農", lang: "中文", genres: ["Indie", "Mandopop"], moods: ["焦慮", "無感"], weather: ["cloudy", "rainy"], duration: "04:26" },
  { title: "玉仔的心", artist: "鄭宜農", lang: "中文", genres: ["Indie"], moods: ["平靜", "疲憊"], weather: ["rainy", "cloudy"], duration: "05:05" },
  { title: "旅行的意義", artist: "陳綺貞", lang: "中文", genres: ["Indie", "Mandopop", "Acoustic"], moods: ["平靜", "難過"], weather: ["cloudy", "rainy"], duration: "04:18" },
  { title: "太陽", artist: "陳綺貞", lang: "中文", genres: ["Indie", "Pop"], moods: ["開心", "放鬆"], weather: ["sunny"], duration: "04:08" }
];

function classifyWeather(code) {
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(code)) return "rainy";
  if ([2, 3, 45, 48].includes(code)) return "cloudy";
  return "sunny";
}

function weatherIcon(type, className = "h-12 w-12") {
  if (type === "rainy") return <CloudRain className={className} strokeWidth={1.5} />;
  if (type === "sunny") return <Sun className={className} strokeWidth={1.5} />;
  return <Cloud className={className} strokeWidth={1.5} />;
}

function genreIcon(genre) {
  const props = { size: 24, strokeWidth: 1.45 };
  const map = {
    All: <Music {...props} />,
    "Indie / 文青": <Guitar {...props} />,
    "Lo-fi / Chill": <Headphones {...props} />,
    "華語流行": <Piano {...props} />,
    "英文流行": <Star {...props} />,
    "R&B 靈魂": <Heart {...props} />,
    嘻哈: <Mic2 {...props} />,
    搖滾: <Zap {...props} />,
    Jazz: <Music2 {...props} />,
    夜晚感: <Moon {...props} />,
    Emo: <CloudRain {...props} />,
    "Acoustic / 民謠": <Guitar {...props} />,
  };
  return map[genre] || <Music {...props} />;
}

function MoodDoodle({ mood }) {
  const pose = {
    平靜: { head: 24, body: "M24 25 L24 50", arms: "M14 36 L34 36", legs: "M24 50 L16 68 M24 50 L32 68", accent: "M18 70 H30" },
    放鬆: { head: 23, body: "M25 28 C18 38 16 47 24 54", arms: "M24 40 C14 42 12 50 20 54 M28 38 C38 39 42 45 39 52", legs: "M24 54 L13 67 M25 55 L39 62", accent: "M38 58 L45 61" },
    開心: { head: 24, body: "M24 26 L24 51", arms: "M13 34 L24 24 L35 34", legs: "M24 51 L15 68 M24 51 L33 68", accent: "M18 15 L15 10 M30 15 L33 10" },
    難過: { head: 23, body: "M25 28 C17 39 17 54 28 60", arms: "M22 42 C15 47 14 55 19 61 M29 40 C35 46 36 55 31 63", legs: "M26 60 L18 70 M28 60 L37 70", accent: "M16 20 C21 17 27 17 32 20" },
    疲憊: { head: 24, body: "M24 27 C21 39 22 50 26 60", arms: "M20 43 L14 58 M28 43 L34 58", legs: "M25 60 L18 70 M27 60 L36 69", accent: "M16 74 H35" },
    無感: { head: 24, body: "M24 28 L24 53", arms: "M16 40 L32 40", legs: "M24 53 L18 68 M24 53 L31 68", accent: "M18 20 H30" },
    暴躁: { head: 24, body: "M24 27 L24 51", arms: "M13 40 L23 32 M25 32 L37 39", legs: "M24 51 L14 68 M24 51 L35 68", accent: "M35 17 L42 10 M39 22 L47 20" },
    焦慮: { head: 24, body: "M24 27 C18 36 17 48 24 56", arms: "M18 39 L11 52 M29 38 L37 48", legs: "M24 56 L18 69 M25 56 L31 68", accent: "M37 15 C42 18 44 24 41 30 M12 18 L8 24" },
  }[mood];

  return (
    <svg viewBox="0 0 48 78" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy={pose.head} r="7" />
      <path d={pose.body} />
      <path d={pose.arms} />
      <path d={pose.legs} />
      <path d={pose.accent} />
      <path d="M21 23 H22 M26 23 H27" />
    </svg>
  );
}

function generatedSceneUrl({ weatherType, mood, genre, seed }) {
  const palette = {
    sunny: {
      sky: "#efe5cf",
      sky2: "#f8f0df",
      tree: "#4f5636",
      tree2: "#7c774d",
      lake: "#8d7a55",
      light: "#f2c878",
    },
    cloudy: {
      sky: "#e9e4d8",
      sky2: "#f6f1e8",
      tree: "#3f4938",
      tree2: "#6c7055",
      lake: "#786f5c",
      light: "#d7c8a6",
    },
    rainy: {
      sky: "#d8d7cf",
      sky2: "#f0ece4",
      tree: "#334038",
      tree2: "#596558",
      lake: "#5f625b",
      light: "#b8b0a2",
    },
  }[weatherType];

  const moodTone = {
    平靜: "#f5ead8",
    放鬆: "#f1dfc2",
    開心: "#f6d58a",
    難過: "#c9c1b6",
    疲憊: "#d8d0bf",
    無感: "#e7e1d6",
    暴躁: "#d8aa79",
    焦慮: "#d5c4b2",
  }[mood];

  const genreMark = encodeURIComponent(`${mood} · ${genre}`);
  const orangeStamp = weatherType === "sunny" ? "#d86f2e" : weatherType === "rainy" ? "#bf714f" : "#c87a3a";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1400">
      <defs>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="${seed}"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.16"/></feComponentTransfer>
        </filter>
        <filter id="soft"><feGaussianBlur stdDeviation="0.55"/></filter>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${palette.sky2}"/>
          <stop offset="0.45" stop-color="${palette.sky}"/>
          <stop offset="1" stop-color="${moodTone}"/>
        </linearGradient>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${palette.lake}" stop-opacity="0.92"/>
          <stop offset="1" stop-color="#eadcc2" stop-opacity="0.9"/>
        </linearGradient>
        <radialGradient id="sun" cx="24%" cy="18%" r="55%">
          <stop offset="0" stop-color="${palette.light}" stop-opacity="0.75"/>
          <stop offset="1" stop-color="${palette.light}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="900" height="1400" fill="url(#sky)"/>
      <rect width="900" height="1400" fill="url(#sun)"/>

      <g opacity="0.95" filter="url(#soft)">
        <path d="M0 440 C80 370 140 430 200 360 C260 285 330 420 390 330 C465 250 545 385 620 315 C705 238 765 370 900 300 L900 670 L0 670 Z" fill="${palette.tree}"/>
        <path d="M0 500 C100 420 160 500 250 410 C330 330 390 480 485 390 C590 280 650 455 740 365 C810 300 850 360 900 330 L900 675 L0 675 Z" fill="${palette.tree2}" opacity="0.82"/>
        ${Array.from({ length: 22 }).map((_, i) => {
          const x = (i * 43 + seed * 7) % 940 - 20;
          const h = 120 + ((i * 31 + seed) % 130);
          const w = 42 + ((i * 19) % 52);
          return `<ellipse cx="${x}" cy="${505 - h / 4}" rx="${w}" ry="${h}" fill="${i % 2 ? palette.tree : palette.tree2}" opacity="${0.22 + (i % 5) * 0.08}"/>`;
        }).join("")}
      </g>

      <rect x="0" y="650" width="900" height="360" fill="url(#lake)"/>
      <g opacity="0.28">
        ${Array.from({ length: 20 }).map((_, i) => {
          const y = 690 + i * 14;
          const x = (i * 57 + seed * 3) % 520;
          const len = 120 + ((i * 31) % 300);
          return `<path d="M${x} ${y} C${x + 80} ${y - 8} ${x + 160} ${y + 8} ${x + len} ${y}" stroke="#f7ead2" stroke-width="${1 + (i % 3)}" fill="none"/>`;
        }).join("")}
      </g>

      <path d="M0 990 C160 930 320 980 450 945 C610 905 735 960 900 905 L900 1400 L0 1400 Z" fill="#ead9bd"/>
      <path d="M0 1018 C210 980 340 1030 500 985 C650 945 760 990 900 942" stroke="#fff4df" stroke-width="16" opacity="0.65" fill="none"/>

      <g transform="translate(500 905)">
        <ellipse cx="0" cy="100" rx="185" ry="28" fill="#8a7659" opacity="0.2"/>
        <path d="M-160 102 C-115 78 -65 78 -18 101" stroke="#f1e3c9" stroke-width="18" stroke-linecap="round"/>
        <path d="M42 102 C92 78 145 80 188 102" stroke="#c7ad86" stroke-width="18" stroke-linecap="round"/>
        <g transform="translate(-35 0)">
          <circle cx="0" cy="0" r="28" fill="#2b2825"/>
          <path d="M-30 33 C-50 80 -35 127 -8 150 C20 124 30 80 16 34 Z" fill="#8c5f49"/>
          <path d="M-42 58 C-74 84 -88 120 -86 150" stroke="#8c5f49" stroke-width="17" stroke-linecap="round"/>
        </g>
        <g transform="translate(55 -16)">
          <circle cx="0" cy="0" r="31" fill="#4b3728"/>
          <path d="M-24 38 C-42 91 -18 139 23 154 C57 118 64 71 31 34 Z" fill="#2d3551"/>
          <path d="M34 65 C78 80 100 111 110 150" stroke="#2d3551" stroke-width="18" stroke-linecap="round"/>
        </g>
      </g>

      <text x="86" y="795" transform="rotate(90 86 795)" font-family="monospace" font-size="34" fill="${orangeStamp}" opacity="0.72">22 06 25</text>
      <text x="64" y="1320" font-family="system-ui, sans-serif" font-size="28" fill="#7d6e5e" opacity="0.35">${genreMark}</text>
      <rect width="900" height="1400" filter="url(#grain)" opacity="0.42"/>
      <rect x="18" y="18" width="864" height="1364" fill="none" stroke="#fff7e8" stroke-width="22" opacity="0.18"/>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function fallbackSceneUrl(weatherType) {
  return generatedSceneUrl({ weatherType, mood: "平靜", genre: "Indie", seed: 121 });
}

export default function WenshanWeatherMusicRecommender() {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMood, setSelectedMood] = useState("平靜");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [songMeta, setSongMeta] = useState({});
  const [imageSeed, setImageSeed] = useState(417);
  const resultRef = useRef(null);

  async function fetchWeather() {
    setLoadingWeather(true);
    setError("");
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${WENSHAN.latitude}&longitude=${WENSHAN.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FTaipei`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("weather request failed");
      const data = await response.json();
      setWeather(data.current);
    } catch {
      setError("目前無法取得即時天氣，先以多雲情境推薦。");
      setWeather({ temperature_2m: 27, apparent_temperature: 29, relative_humidity_2m: 78, precipitation: 0, wind_speed_10m: 9, weather_code: 3 });
    } finally {
      setLoadingWeather(false);
    }
  }

  useEffect(() => {
    fetchWeather();
  }, []);

  const weatherType = useMemo(() => classifyWeather(weather?.weather_code ?? 3), [weather]);
  const weatherText = weatherCodeMap[weather?.weather_code] || "天氣資訊";
  const sceneImage = useMemo(
    () => generatedSceneUrl({ weatherType, mood: selectedMood, genre: selectedGenre, seed: imageSeed }),
    [weatherType, selectedMood, selectedGenre, imageSeed]
  );
  const fallbackImage = useMemo(() => fallbackSceneUrl(weatherType), [weatherType]);

  const recommendations = useMemo(() => {
    const combo = `${selectedGenre}-${selectedMood}-${weatherType}-${imageSeed}`;
    const baseHash = comboHash(combo);
    const mappedGenres = genreAliases[selectedGenre] || [selectedGenre];

    const ranked = songLibrary
      .map((song, index) => {
        const genreMatch = selectedGenre === "All" || mappedGenres.some((g) => song.genres.includes(g));
        const moodMatch = song.moods.includes(selectedMood);
        const weatherMatch = song.weather.includes(weatherType);

        let score = 0;
        if (selectedGenre === "All") score += 2;
        if (mappedGenres.some((g) => song.genres.includes(g))) score += 10;
        if (moodMatch) score += 9;
        if (weatherMatch) score += 4;
        if (song.lang === "中文") score += 0.35;

        const variety = ((baseHash + index * 73) % 1000) / 100;
        const strictnessBonus = genreMatch && moodMatch ? 5 : 0;
        return { ...song, score: score + variety + strictnessBonus };
      })
      .filter((song) => selectedGenre === "All" || mappedGenres.some((g) => song.genres.includes(g)) || song.moods.includes(selectedMood))
      .sort((a, b) => b.score - a.score);

    const offset = baseHash % Math.max(1, Math.min(7, ranked.length));
    const rotated = [...ranked.slice(offset), ...ranked.slice(0, offset)];

    const picked = [];
    const artists = new Set();
    const languages = new Set();

    for (const song of rotated) {
      if (picked.length === 3) break;
      if (artists.has(song.artist)) continue;
      if (selectedGenre !== "All" && !mappedGenres.some((g) => song.genres.includes(g)) && picked.length < 2) continue;
      picked.push(song);
      artists.add(song.artist);
      languages.add(song.lang);
    }

    for (const song of rotated) {
      if (picked.length === 3) break;
      if (artists.has(song.artist)) continue;
      if (languages.size < 2 && languages.has(song.lang)) continue;
      picked.push(song);
      artists.add(song.artist);
      languages.add(song.lang);
    }

    for (const song of rotated) {
      if (picked.length === 3) break;
      if (artists.has(song.artist)) continue;
      picked.push(song);
      artists.add(song.artist);
    }

    return picked;
  }, [selectedGenre, selectedMood, weatherType, imageSeed]);

  useEffect(() => {
    let cancelled = false;
    async function fetchSongMeta() {
      const nextMeta = {};
      await Promise.all(
        recommendations.map(async (song) => {
          const key = `${song.title}-${song.artist}`;
          try {
            const term = encodeURIComponent(`${song.title} ${song.artist}`);
            let response = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=1`);
            let data = await response.json();
            let item = data.results?.[0];

            if (!item) {
              const backupTerm = encodeURIComponent(song.title);
              response = await fetch(`https://itunes.apple.com/search?term=${backupTerm}&media=music&entity=song&limit=3`);
              data = await response.json();
              item = data.results?.find((result) => result.previewUrl) || data.results?.[0];
            }
            if (item) {
              nextMeta[key] = {
                artwork: item.artworkUrl100?.replace("100x100bb", "600x600bb"),
                preview: item.previewUrl,
                album: item.collectionName,
                link: item.trackViewUrl,
              };
            }
          } catch {
            nextMeta[key] = {};
          }
        })
      );
      if (!cancelled) setSongMeta(nextMeta);
    }
    if (recommendations.length) fetchSongMeta();
    return () => {
      cancelled = true;
    };
  }, [recommendations]);

  function handleRecommend() {
    setShowResult(false);
    setImageSeed((prev) => prev + comboHash(`${selectedGenre}-${selectedMood}-${weatherType}`) % 53 + 7);

    setTimeout(() => {
      setShowResult(true);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }, 220);
  }

  return (
    <main className="min-h-screen bg-[#eee8dc] text-[#232323] sm:flex sm:justify-center">
      <div className="min-h-screen w-full bg-[#f6f1e8] font-sans sm:max-w-[430px] sm:shadow-2xl">
        <section className="relative overflow-hidden px-5 pb-10 pt-7">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-[1.5px] w-5 bg-[#232323]" />
              <div className="h-[1.5px] w-5 bg-[#232323]" />
            </div>
            <div className="flex items-center gap-2 text-[13px] tracking-[0.18em]">
              <MapPin size={18} strokeWidth={1.7} />
              {WENSHAN.name}
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <img
              src={sceneImage}
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
              alt="根據天氣、心情與音樂類型生成的一男一女湖邊底片感照片"
              className="absolute right-[-118px] top-0 h-[330px] w-[390px] rounded-bl-[5rem] object-cover object-center saturate-[0.82] sepia-[0.16]"
            />
            <div className="absolute left-[122px] top-0 h-[330px] w-[110px] bg-gradient-to-r from-[#f6f1e8] via-[#f6f1e8]/75 to-transparent" />
            <div className="absolute right-[-118px] top-[305px] h-20 w-[390px] bg-gradient-to-b from-transparent to-[#f6f1e8]" />

            <div className="relative z-10 pt-12">
              <div className="mb-5 flex items-center gap-5">
                <div className="text-[5.7rem] font-light leading-none tracking-[-0.1em]">
                  {loadingWeather ? "--" : Math.round(weather?.temperature_2m ?? 0)}°
                </div>
                <div>{weatherIcon(weatherType, "h-14 w-14")}</div>
              </div>
              <h1 className="text-xl font-medium tracking-[0.25em]">{loadingWeather ? "讀取中" : weatherText}</h1>
              <p className="mt-4 text-[15px] tracking-[0.12em] text-[#57534c]">體感 {Math.round(weather?.apparent_temperature ?? 0)}°C</p>

              <div className="mt-10 space-y-4 text-[15px] tracking-[0.06em] text-[#4f4a43]">
                <div className="flex w-44 items-center justify-between">
                  <span className="flex items-center gap-3"><Droplets size={18} strokeWidth={1.5} />濕度</span><span>{weather?.relative_humidity_2m ?? "--"}%</span>
                </div>
                <div className="flex w-44 items-center justify-between">
                  <span className="flex items-center gap-3"><Wind size={18} strokeWidth={1.5} />風速</span><span>{weather?.wind_speed_10m ?? "--"}</span>
                </div>
                <div className="flex w-44 items-center justify-between">
                  <span className="flex items-center gap-3"><CloudRain size={18} strokeWidth={1.5} />降雨量</span><span>{weather?.precipitation ?? "--"} mm</span>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="mt-3 rounded-2xl bg-black/5 p-3 text-xs text-[#6b6258]">{error}</p>}
        </section>

        <section className="px-5 pb-10">
          <h2 className="mb-5 text-[22px] font-medium tracking-[0.12em]">今天，你的心情是？</h2>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`min-h-[96px] rounded-xl border px-2 py-3 shadow-[0_4px_12px_rgba(52,43,31,0.08)] transition ${
                  selectedMood === mood ? "border-[#232323] bg-[#eee5d8]" : "border-[#ded6ca] bg-[#faf7f0]"
                }`}
              >
                <div className="mx-auto mb-1 flex justify-center text-[#262626]"><MoodDoodle mood={mood} /></div>
                <div className="text-[14px] font-medium tracking-[0.12em]">{mood}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pb-10">
          <h2 className="mb-5 text-[22px] font-medium tracking-[0.12em]">想聽的音樂類型是？</h2>
          <div className="grid grid-cols-3 gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`min-h-[82px] rounded-xl border px-2 py-3 shadow-[0_4px_12px_rgba(52,43,31,0.08)] transition ${
                  selectedGenre === genre ? "border-[#232323] bg-[#eee5d8]" : "border-[#ded6ca] bg-[#faf7f0]"
                }`}
              >
                <div className="mb-2 flex justify-center text-[#262626]">{genreIcon(genre)}</div>
                <div className="text-[13px] font-medium tracking-[0.03em]">{genre}</div>
              </button>
            ))}
          </div>

          <Button onClick={handleRecommend} className="mx-auto mt-9 flex w-[68%] rounded-lg bg-[#1f1f1f] py-6 text-base tracking-[0.2em] text-white hover:bg-[#2d2d2d]">
            為我推薦 →
          </Button>
        </section>

        <section ref={resultRef} className="relative min-h-[88svh] overflow-hidden px-5 pb-12 pt-4">
          <div className="absolute bottom-0 left-0 right-0 h-[380px] overflow-hidden">
            <img
              src={sceneImage}
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
              alt="推薦歌曲對應生成情境照"
              className="h-full w-full object-cover object-center opacity-90 saturate-[0.82] sepia-[0.16]"
            />
            <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-[#f6f1e8] via-[#f6f1e8]/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <h2 className="mb-5 text-[22px] font-medium tracking-[0.12em]">為你推薦的歌曲</h2>
            <AnimatePresence mode="wait">
              {showResult ? (
                <motion.div
                  key={`${selectedGenre}-${selectedMood}-${weatherType}-${imageSeed}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.55 }}
                  className="space-y-3"
                >
                  <p className="mb-4 text-sm leading-7 tracking-[0.08em] text-[#5c554c]">{moodCaptions[selectedMood]}</p>
                  {recommendations.map((song, index) => {
                    const meta = songMeta[`${song.title}-${song.artist}`] || {};
                    return (
                      <motion.article
                        key={`${song.title}-${song.artist}`}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                        className="grid grid-cols-[64px_1fr] items-center gap-4 rounded-2xl border border-[#ddd4c8] bg-[#fbf8f1]/90 p-3 shadow-[0_8px_20px_rgba(60,48,34,0.12)] backdrop-blur-sm"
                      >
                        <div className="h-14 w-14 overflow-hidden rounded-lg bg-[#ddd4c8]">
                          <img src={meta.artwork || sceneImage} alt={`${song.title} album cover`} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[17px] font-medium tracking-[0.02em] text-[#242424]">{song.title}</p>
                          <p className="mt-1 truncate text-[13px] text-[#5f5a52]">{song.artist}</p>
                          <div className="mt-2 flex items-center gap-2 text-[11px] text-[#8a8176]"><span>{song.lang}</span><span>·</span><span>{song.duration}</span></div>
                          {meta.preview ? (
                            <audio controls src={meta.preview} className="mt-2 h-8 w-full" />
                          ) : (
                            <a
                              href={meta.link || musicSearchUrl(song)}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex rounded-full border border-[#d7cabc] px-3 py-1 text-[11px] tracking-[0.08em] text-[#6f6257]"
                            >
                              開啟音樂搜尋
                            </a>
                          )}
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="rounded-2xl border border-[#ddd4c8] bg-[#fbf8f1]/80 p-5 text-center text-sm leading-7 tracking-[0.08em] text-[#70685e]">
                  選好心情與音樂類型後，按下「為我推薦」會直接跳到這裡。
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        
      </div>
    </main>
  );
}
