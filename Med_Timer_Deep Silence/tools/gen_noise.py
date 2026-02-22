"""
ブラウンノイズ・グリーンノイズ WAV 生成スクリプト
- スペクトル合成方式: 完全シームレスループ
- 出力: assets/audio/brown_noise.wav, assets/audio/green_noise.wav
- 仕様: モノラル, 44100 Hz, 16-bit PCM, 30秒
"""

import wave
import os
import numpy as np

SR = 44100
DURATION = 30          # 30秒ループ（瞑想用途で繰り返し再生）
N = SR * DURATION
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'audio')


def generate_loopable_noise(n: int, sr: int, shape_fn) -> np.ndarray:
    """スペクトル合成でシームレスループ対応ノイズを生成する。"""
    freqs = np.fft.rfftfreq(n, 1 / sr)
    rng = np.random.default_rng(seed=42)
    phases = rng.uniform(0, 2 * np.pi, len(freqs))
    amplitudes = shape_fn(freqs)
    spectrum = amplitudes * np.exp(1j * phases)
    spectrum[0] = 0  # DCオフセット除去
    signal = np.fft.irfft(spectrum, n)
    # -0.7 〜 +0.7 に正規化（クリッピング余裕を持たせる）
    peak = np.max(np.abs(signal))
    if peak > 0:
        signal /= peak
    signal *= 0.70
    return signal


def brown_shape(freqs: np.ndarray) -> np.ndarray:
    """ブラウンノイズ: 振幅 ∝ 1/f（パワー ∝ 1/f²）"""
    shape = np.where(freqs > 20, 1.0 / freqs, 0.0)
    return shape


def green_shape(freqs: np.ndarray) -> np.ndarray:
    """グリーンノイズ: 可聴域中央（700 Hz）中心のガウシアンバンドパス"""
    center, sigma = 700.0, 400.0
    shape = np.exp(-((freqs - center) ** 2) / (2 * sigma ** 2))
    shape[freqs < 80] = 0    # 低域を落として奥行きを出す
    shape[freqs > 4000] = 0  # 高域の刺激を抑える
    return shape


def save_wav(path: str, data: np.ndarray, sr: int) -> None:
    pcm = (data * 32767).astype(np.int16)
    with wave.open(path, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes(pcm.tobytes())
    size_kb = os.path.getsize(path) // 1024
    print(f'  -> {os.path.basename(path)}: {len(data)/sr:.1f}s, {size_kb} KB')


def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f'生成先: {os.path.abspath(OUTPUT_DIR)}')

    print('ブラウンノイズ生成中...')
    brown = generate_loopable_noise(N, SR, brown_shape)
    save_wav(os.path.join(OUTPUT_DIR, 'brown_noise.wav'), brown, SR)

    print('グリーンノイズ生成中...')
    green = generate_loopable_noise(N, SR, green_shape)
    save_wav(os.path.join(OUTPUT_DIR, 'green_noise.wav'), green, SR)

    print('完了')


if __name__ == '__main__':
    main()
