/* eslint-disable @typescript-eslint/no-unused-vars */
import {proxy} from 'valtio';


export const emotionEnum = {
    angry: "生气",
    disgusted: "厌恶",
    fearful: "害怕",
    happy: "开心",
    neutral: "中立",
    sad: "伤心",
    surprised: "惊讶",
};


export default class ContextService {
    state;

    constructor() {
        this.state = proxy({
            sessionId: '',

            age: null,
            gender: '',
            dominantExpression: '',

            transcript: '',
        });
    }

    // 更新用户信息的方法
    updateUserInfo(age, gender, dominantExpression) {
        this.state.age = age.toFixed();
        this.state.gender = gender;
        this.state.dominantExpression = emotionEnum[dominantExpression];
    }

    // 追加文本到 transcript
    appendTranscript(text) {
        this.state.transcript += text;
    }

    // 为 transcript 添加标点符号
    addPunctuation() {
        if (!this.state.transcript.endsWith('，') && !this.state.transcript.endsWith('。')) {
            const punctuation = Math.random() < 0.5 ? '，' : '。';
            this.state.transcript += punctuation;
        }
    }
}
