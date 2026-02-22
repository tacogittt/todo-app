"""
ブラウンノイズ・グリーンノイズ WAV 生成スクリプト
- スペクトル合成方式: 完全シームレスループ
- 出力: assets/audio/brown_noise.wav, assets/audio/green_noise.wav
- 仕様: モノラル, 44100 Hz, 16-bit PCM, 30秒

ノイズ特性:
  brown_noise: 振幅 ∝ 1/f^2.0 + 400Hz以降を急減衰 → 超低域特化「ドーっ」サウンド
  green_noise: 中心400Hz ガウシアン、帯域80-2000Hz → 耳障りな高域なし、自然な中域
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
    # RMS正規化: 目標 RMS = 0.25（クリッピング余裕を持たせる）
    rms = np.sqrt(np.mean(signal ** 2))
    if rms > 0:
        signal = signal / rms * 0.25
    # ピーク超過をソフトクリップ
    signal = np.tanh(signal)
    return signal


def brown_shape(freqs: np.ndarray) -> np.ndarray:
    """ブラウンノイズ:「ドーっ」超低域特化
    振幅 ∝ 1/f^2.0 + 400Hz以降を急激にロールオフ
    20-400Hz が支配的、高域はほぼゼロ"""
    # 振幅スペクトル: 1/f^2.0（非常に急峻な低域強調）
    shape = np.where(freqs > 20, 1.0 / np.power(freqs, 2.0), 0.0)
    # 400Hz以降を急激に減衰（時定数 80Hz → 500Hz で -20dB）
    rolloff = np.where(freqs > 400, np.exp(-(freqs - 400.0) / 80.0), 1.0)
    return shape * rolloff


def green_shape(freqs: np.ndarray) -> np.ndarray:
    """グリーンノイズ: 中心400Hz ガウシアンバンドパス
    帯域: 80Hz–2000Hz（耳障りな高域をカット）"""
    center, sigma = 400.0, 180.0
    shape = np.exp(-((freqs - center) ** 2) / (2 * sigma ** 2))
    shape[freqs < 80] = 0     # サブベース除去
    shape[freqs > 2000] = 0   # 2000Hz以上をハードカット
    return shape


def save_wav(path: str, data: np.ndarray, sr: int) -> None:
    pcm = np.clip(data * 32767, -32768, 32767).astype(np.int16)
    with wave.open(path, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes(pcm.tobytes())
    size_kb = os.path.getsize(path) // 1024
    rms_db = 20 * np.log10(np.sqrt(np.mean(data ** 2)) + 1e-10)
    print(f'  -> {os.path.basename(path)}: {len(data)/sr:.1f}s, {size_kb} KB, RMS={rms_db:.1f}dBFS')


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
