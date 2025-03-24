"use client";

import { useEffect, useState, useRef, memo } from 'react'
import { motion } from 'framer-motion'

interface DecryptedTextProps {
    text: string
    speed?: number
    maxIterations?: number
    sequential?: boolean
    revealDirection?: 'start' | 'end' | 'center'
    useOriginalCharsOnly?: boolean
    characters?: string
    className?: string
    encryptedClassName?: string
    parentClassName?: string
    animateOn?: 'hover' | 'view' | 'loop'
    [key: string]: any
}

// Create a memoized character component to avoid unnecessary re-renders
const Character = memo(({ 
    char, 
    isRevealed, 
    isScrambling, 
    className, 
    encryptedClassName 
}: { 
    char: string, 
    isRevealed: boolean, 
    isScrambling: boolean,
    className: string,
    encryptedClassName: string
}) => {
    return (
        <span className={isRevealed || !isScrambling ? className : encryptedClassName}>
            {char}
        </span>
    );
});

Character.displayName = 'Character';

function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
    ...props
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState<string>(text)
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const [isScrambling, setIsScrambling] = useState<boolean>(false)
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
    const [hasAnimated, setHasAnimated] = useState<boolean>(false)
    const containerRef = useRef<HTMLSpanElement>(null)
    const intervalRef = useRef<any>(null);
    const iterationRef = useRef<number>(0);

    // Optimization: pre-compute available characters
    const availableChars = useRef(
        useOriginalCharsOnly
            ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
            : characters.split('')
    ).current;

    // Clean up function to prevent memory leaks
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const getNextIndex = (revealedSet: Set<number>): number => {
            const textLength = text.length
            switch (revealDirection) {
                case 'start':
                    return revealedSet.size
                case 'end':
                    return textLength - 1 - revealedSet.size
                case 'center': {
                    const middle = Math.floor(textLength / 2)
                    const offset = Math.floor(revealedSet.size / 2)
                    const nextIndex =
                        revealedSet.size % 2 === 0
                            ? middle + offset
                            : middle - offset - 1

                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                        return nextIndex
                    }
                    for (let i = 0; i < textLength; i++) {
                        if (!revealedSet.has(i)) return i
                    }
                    return 0
                }
                default:
                    return revealedSet.size
            }
        }

        const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
            return originalText
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' '
                    if (currentRevealed.has(i)) return originalText[i]
                    return availableChars[Math.floor(Math.random() * availableChars.length)]
                })
                .join('')
        }

        if (isHovering) {
            setIsScrambling(true)
            iterationRef.current = 0;
            
            intervalRef.current = setInterval(() => {
                setRevealedIndices((prevRevealed) => {
                    if (sequential) {
                        if (prevRevealed.size < text.length) {
                            const nextIndex = getNextIndex(prevRevealed)
                            const newRevealed = new Set(prevRevealed)
                            newRevealed.add(nextIndex)
                            setDisplayText(shuffleText(text, newRevealed))
                            return newRevealed
                        } else {
                            clearInterval(intervalRef.current)
                            setIsScrambling(false)
                            
                            // Only reset hovering for hover mode
                            if (animateOn === 'hover') {
                                setIsHovering(false)
                            }
                            
                            return prevRevealed
                        }
                    } else {
                        setDisplayText(shuffleText(text, prevRevealed))
                        iterationRef.current++;
                        if (iterationRef.current >= maxIterations) {
                            clearInterval(intervalRef.current)
                            setIsScrambling(false)
                            setDisplayText(text)
                            
                            // Only reset hovering for hover mode
                            if (animateOn === 'hover') {
                                setIsHovering(false)
                            }
                        }
                        return prevRevealed
                    }
                })
            }, speed)
        } else if (animateOn !== 'loop') {
            // Don't reset for loop mode
            setDisplayText(text)
            setRevealedIndices(new Set())
            setIsScrambling(false)
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null;
            }
        }
    }, [isHovering, speed, text, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly, animateOn]);

    useEffect(() => {
        if (animateOn !== 'view') return

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setIsHovering(true)
                    setHasAnimated(true)
                }
            })
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)
        const currentRef = containerRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef)
        }
    }, [animateOn, hasAnimated])

    // Add useEffect for loop mode
    useEffect(() => {
        // Only proceed if animateOn is 'loop'
        if (animateOn !== 'loop') return;
        
        // Handle looping animation
        const startAnimation = () => {
            setIsHovering(true);
            setRevealedIndices(new Set());
        };

        const resetAnimation = () => {
            setIsHovering(false);
            setDisplayText(text);
        };

        // If animation is complete, schedule the next one
        if (!isScrambling && isHovering) {
            const timeout = setTimeout(() => {
                resetAnimation();
                
                // Start next animation after a pause
                const nextAnimTimeout = setTimeout(() => {
                    startAnimation();
                }, 2000);
                
                return () => {
                    clearTimeout(nextAnimTimeout);
                };
            }, 3000);
            
            return () => {
                clearTimeout(timeout);
            };
        }
        
        // Start initial animation if not already running
        if (!isHovering && !isScrambling) {
            const initialTimeout = setTimeout(() => {
                startAnimation();
            }, 1000);
            
            return () => {
                clearTimeout(initialTimeout);
            };
        }
    }, [animateOn, isHovering, isScrambling, text]);

    const hoverProps =
        animateOn === 'hover'
            ? {
                onMouseEnter: () => setIsHovering(true),
                onMouseLeave: () => setIsHovering(false),
            }
            : {}

    // Optimization: only animate when in viewport
    return (
        <motion.span
            ref={containerRef}
            className={`inline-block whitespace-pre-wrap ${parentClassName}`}
            {...hoverProps}
            {...props}
        >
            <span className="sr-only">{text}</span>

            <span aria-hidden="true">
                {displayText.split('').map((char, index) => (
                    <Character
                        key={index}
                        char={char}
                        isRevealed={revealedIndices.has(index)}
                        isScrambling={isScrambling}
                        className={className}
                        encryptedClassName={encryptedClassName}
                    />
                ))}
            </span>
        </motion.span>
    )
}

// Export a memoized version of the component to prevent unnecessary re-renders
export default memo(DecryptedText); 