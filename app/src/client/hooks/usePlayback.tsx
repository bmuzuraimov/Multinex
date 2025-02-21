// import { useState, useEffect, useRef, useCallback } from 'react';
// import { TextList } from '../utils/TextList';
// interface UsePlaybackProps {
//   essayList: TextList;
//   onSubmitExercise: () => void;
//   audioUrl: string;
//   audioTimestamps: Array<{word: string, start: number, end: number}> | string[];
// }

// const usePlayback = ({
//   essayList,
//   onSubmitExercise,
//   audioUrl,
//   audioTimestamps,
// }: UsePlaybackProps) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const rafIdRef = useRef<number | null>(null);

//   const setAudioTime = useCallback((time: number) => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = time;
//     }
//   }, []);

//   // Load audio once audioUrl changes
//   useEffect(() => {
//     if (audioUrl) {
//       const loadAudio = async () => {
//         try {
//           const audio = new Audio();
//           audio.src = audioUrl; // audioUrl is the S3 URL
//           audio.onerror = (e) => {
//             console.error('Error loading audio:', e);
//           };
//           audioRef.current = audio;
//         } catch (err) {
//           console.error('Error importing audio file:', err);
//         }
//       };
//       loadAudio();
//     }
//   }, [audioUrl]);

//   // Update audio playback (play/pause) when isPlaying changes
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.play().catch((err) => {
//         console.error('Error playing audio:', err);
//         setIsPlaying(false);
//       });
//     } else {
//       audio.pause();
//     }
//   }, [isPlaying]);

//   // Cleanup highlight + set up "ready to start" state
//   const stopPlayback = useCallback(() => {
//     // Cancel any pending animation frames
//     if (rafIdRef.current !== null) {
//       cancelAnimationFrame(rafIdRef.current);
//       rafIdRef.current = null;
//     }

//     setIsPlaying(false);

//     // Add border bottom to next char when stopped
//     essayList.setCursor(essayList.getCursor()?.next);
//   }, [essayList]);

//   // Core logic: on each animation frame, we check the audio's currentTime 
//   // and advance highlighting if we've passed the next word's start time.
//   const syncTextToAudio = useCallback(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const currentTimeMs = audio.currentTime * 1000; // convert to ms

//     essayList.setCursor(essayList.getCursor()?.next);

//     // Handle empty audioTimestamps array
//     if (!audioTimestamps.length) {
//       stopPlayback();
//       return;
//     }

//       // Check if audioTimestamps is in the correct format
//       const timestamp = audioTimestamps[wordIndex];
//       if (!timestamp || typeof timestamp !== 'object' || !('start' in timestamp) || !('end' in timestamp)) {
//         console.error('Invalid timestamp format:', timestamp);
//         stopPlayback();
//         return prevIndex;
//       }

//       const { start, end } = timestamp as { word: string, start: number, end: number };

//       // Convert to ms for direct comparison with currentTimeMs
//       const endMs = end * 1000;
//       const startMs = start * 1000;
//       // If we haven't reached the start of this word yet, do nothing.
//       if (currentTimeMs < endMs) {
//         return prevIndex;
//       }

//       // Otherwise, find and highlight the current word
//       // ---------------------------
//       // 1) Find the boundaries of the current word
//       let wordStart = prevIndex;
//       while (
//         wordStart > 0 &&
//         essay[wordStart - 1] !== ' ' &&
//         essay[wordStart - 1] !== '\n'
//       ) {
//         wordStart--;
//       }

//       let wordEnd = prevIndex;
//       while (
//         wordEnd < essay.length &&
//         essay[wordEnd] !== ' ' &&
//         essay[wordEnd] !== '\n'
//       ) {
//         wordEnd++;
//       }
//       // Move wordEnd to the first character of the next word
//       wordEnd++;

//       // 2) Highlight current word
//       for (let i = wordStart; i < wordEnd - 1; i++) {
//         const charElement = essayCharsRef.current[i];
//         charElement?.classList.add('bg-gray-200', 'dark:bg-gray-800');
//       }

//       // 3) Scroll the next word (wordEnd) into view
//       const nextCharElement = essayCharsRef.current[wordEnd];
//       if (nextCharElement?.getAttribute('type') !== 'hear') {
//         // If next type is not "hear", we stop playback
//         stopPlayback();

//         // Highlight all "write" characters if encountered
//         let writeIndex = wordEnd;
//         while (
//           writeIndex < essay.length &&
//           essayCharsRef.current[writeIndex]?.getAttribute('type') === 'write'
//         ) {
//           essayCharsRef.current[writeIndex]?.classList.add('bg-red-500/20');
//           writeIndex++;
//         }

//         // If it's a "type" char, add a border to prompt the user
//         if (nextCharElement?.getAttribute('type') === 'type') {
//           nextCharElement.classList.add(
//             'border-b-4',
//             'border-sky-400',
//             'dark:border-white'
//           );
//         }

//         return wordEnd;
//       }

//       // If still "hear", scroll that next chunk into view
//       (nextCharElement as HTMLElement)?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });

//       // 4) Check end-of-essay
//       if (wordEnd >= essay.length) {
//         stopPlayback();
//         onSubmitExercise();
//         return prevIndex;
//       }

//       // Advance to the next word's first char
//       return wordEnd;
//     });

//     // Schedule next frame
//     rafIdRef.current = requestAnimationFrame(syncTextToAudio);
//   }, [
//     audioTimestamps,
//     essay,
//     essayCharsRef,
//     onSubmitExercise,
//     setCurrentCharacterIndex,
//     stopPlayback,
//   ]);

//   const startPlayback = useCallback(() => {
//     setIsPlaying(true);

//     // Kick off requestAnimationFrame-based sync
//     if (rafIdRef.current == null) {
//       rafIdRef.current = requestAnimationFrame(syncTextToAudio);
//     }
//   }, [syncTextToAudio]);

//   const togglePlayback = useCallback(
//     (forcedState?: boolean) => {
//       // If forcedState is explicitly true or false
//       if (typeof forcedState === 'boolean') {
//         if (forcedState) {
//           startPlayback();
//         } else {
//           stopPlayback();
//         }
//         return;
//       }

//       // Otherwise, just toggle
//       if (isPlaying) {
//         stopPlayback();
//       } else {
//         startPlayback();
//       }
//     },
//     [isPlaying, startPlayback, stopPlayback]
//   );

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (rafIdRef.current !== null) {
//         cancelAnimationFrame(rafIdRef.current);
//       }
//     };
//   }, []);

//   return { isPlaying, togglePlayback, setAudioTime };
// };

// export default usePlayback;
