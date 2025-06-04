// Third-party imports
import {
    Box,
    Button,
    type ButtonProps,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// Local imports
import { userStore } from '@mallcomm/portals-auth';
import useAuth from '../../hooks/useAuth';
import { CMS_USER_TYPE } from '../../constants';

const ColorButton = styled(Button)<ButtonProps>(() => ({
    color: '#08594A',
    backgroundColor: '#13D9B4',
    '&:hover': {
        backgroundColor: '#35EDCC',
    },
    '&:disabled': {
        backgroundColor: '#EDEDED',
    },
}));

// Outer container with smooth transitions
const OuterContainer = styled(Box)({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
});

// Content container that tracks and smoothly transitions height
const ContentWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    overflow: 'visible',
    transition: `height 0.5s ${theme.transitions.easing.easeInOut}`,
}));

// Absolutely positioned content that fades in/out
const AbsoluteContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    transition: `opacity 0.3s ${theme.transitions.easing.easeInOut}`,
}));

/**
 * Authentication selection screen
 * Handles user type selection and email input for login
 */
const SelectAuth: React.FC = () => {
    const { t } = useTranslation();
    const { setUserType } = userStore();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [subtitleVisible, setSubtitleVisible] = useState(true);

    // References to measure content heights
    const initialFormRef = useRef<HTMLDivElement>(null);
    const expandedFormRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);

    // State to track visibility
    const [initialFormVisible, setInitialFormVisible] = useState(true);
    const [expandedFormVisible, setExpandedFormVisible] = useState(false);

    // State to track height
    const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

    // Load saved email from localStorage on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('remembered_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    // Render both forms initially for proper measurement, but hide expanded form
    useEffect(() => {
        // Initialize expanded form but keep it invisible for measurement
        setTimeout(() => {
            if (initialFormRef.current) {
                setContentHeight(initialFormRef.current.offsetHeight);
            }
        }, 10);
    }, []);

    /**
     * Email validation using regex
     */
    const validateEmail = (email: string): boolean => {
        return Boolean(
            String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                ),
        );
    };

    /**
     * Handle user type selection with animation
     */
    const handleUserTypeSelect = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        // First, fade out the subtitle
        setSubtitleVisible(false);

        // First, measure the expanded form in advance (even though it's hidden)
        const expandedHeight = expandedFormRef.current?.offsetHeight || 250;

        // Ensure the initial form height is known
        const initialHeight = initialFormRef.current?.offsetHeight || 60;
        setContentHeight(initialHeight);

        // Start fade out of initial form
        setInitialFormVisible(false);

        // After fade out, start transition to expanded form
        setTimeout(() => {
            // Change to expanded content and set user type
            setUserType(CMS_USER_TYPE);

            // Set the target height first to create the animation effect
            setContentHeight(expandedHeight);

            // Then after a short delay, make the expanded form visible
            setTimeout(() => {
                setExpandedFormVisible(true);
                setIsTransitioning(false);
            }, 150); // Show content during transition
        }, 250); // Wait for fadeout
    };

    /**
     * Handle back button click with animation
     */
    const handleBackClick = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        // Capture current heights
        const expandedHeight = expandedFormRef.current?.offsetHeight || 250;
        const initialHeight = initialFormRef.current?.offsetHeight || 60;

        // Keep height at expanded size while fading out
        setContentHeight(expandedHeight);
        setExpandedFormVisible(false);

        setTimeout(() => {
            // Set the target height for animation
            setContentHeight(initialHeight);

            // Show the subtitle again
            setSubtitleVisible(true);

            // After animation starts, make the initial form visible
            setTimeout(() => {
                setInitialFormVisible(true);
                setIsTransitioning(false);
            }, 150);
        }, 250);
    };

    /**
     * Handle sign in completion
     */
    const handleSignIn = async () => {
        if (!validateEmail(email) || isTransitioning) return;

        setIsTransitioning(true);
        try {
            // Save or remove email from localStorage based on remember me checkbox
            if (rememberMe) {
                localStorage.setItem('remembered_email', email);
            } else {
                localStorage.removeItem('remembered_email');
            }
            await login(email);
        } catch (error) {
            console.error('Sign in error:', error);
            setIsTransitioning(false);
        }
    };

    return (
        <OuterContainer>
            <Box
                sx={{
                    display: 'flex',
                    flexFlow: 'column',
                    gap: '1rem',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                    fontSize="1.5rem"
                    sx={{ py: 2, backgroundColor: '#ffffff', zIndex: 1 }}
                >
                    {t('auth.welcome')}
                </Typography>
                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    fontSize="1.125rem"
                    sx={{
                        opacity: subtitleVisible ? 1 : 0,
                        height: subtitleVisible ? 'auto' : '0',
                        overflow: 'hidden',
                        marginTop: subtitleVisible ? undefined : '-4rem',
                        transition:
                            'opacity 0.3s ease-in-out, height 0.3s ease-in-out, margin-top 0.3s ease-in-out',
                    }}
                >
                    {t('auth.please_select')}
                </Typography>
            </Box>

            <ContentWrapper
                ref={contentWrapperRef}
                sx={{
                    height: contentHeight ? `${contentHeight}px` : 'auto',
                    minHeight: '60px',
                }}
            >
                {/* Initial form - "I work for..." button */}
                <AbsoluteContent
                    ref={initialFormRef}
                    sx={{
                        opacity: initialFormVisible ? 1 : 0,
                        pointerEvents: initialFormVisible ? 'auto' : 'none',
                        zIndex: initialFormVisible ? 2 : 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexFlow: 'column',
                            gap: '1rem',
                            width: '100%',
                        }}
                    >
                        <ColorButton
                            size="small"
                            sx={{
                                padding: '0.5rem',
                                textTransform: 'none',
                            }}
                            color="primary"
                            variant="contained"
                            onClick={handleUserTypeSelect}
                            disabled={isTransitioning}
                        >
                            {t('auth.i_work_for_the_property_management_team')}
                        </ColorButton>
                    </Box>
                </AbsoluteContent>

                {/* Expanded form - Email input */}
                <AbsoluteContent
                    ref={expandedFormRef}
                    sx={{
                        opacity: expandedFormVisible ? 1 : 0,
                        pointerEvents: expandedFormVisible ? 'auto' : 'none',
                        zIndex: expandedFormVisible ? 2 : 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexFlow: 'column',
                            gap: '1rem',
                            width: '100%',
                        }}
                    >
                        <Box>
                            <Button
                                onClick={handleBackClick}
                                color="inherit"
                                size="small"
                                disabled={isTransitioning}
                            >
                                <ArrowBackIosIcon />
                                {t('auth.back')}
                            </Button>
                        </Box>
                        <TextField
                            type="email"
                            label={t('common.email')}
                            value={email}
                            onChange={(e) => {
                                const newEmail = e.target.value;
                                setEmail(newEmail);

                                // If email is cleared, remove from localStorage and uncheck Remember Me
                                if (!newEmail) {
                                    localStorage.removeItem('remembered_email');
                                    setRememberMe(false);
                                }
                            }}
                            variant="outlined"
                            onKeyUp={(e) => {
                                if (e.key === 'Enter' && validateEmail(email)) {
                                    handleSignIn();
                                }
                            }}
                            fullWidth
                            disabled={isTransitioning}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isTransitioning || !email}
                                />
                            }
                            label={t('auth.remember_me')}
                        />
                        <ColorButton
                            size="large"
                            sx={{
                                padding: '0.5rem',
                                textTransform: 'none',
                            }}
                            color="primary"
                            variant="contained"
                            onClick={handleSignIn}
                            disabled={!validateEmail(email) || isTransitioning}
                        >
                            {isTransitioning ? t('auth.please_wait_logging_in') : t('auth.next')}
                        </ColorButton>

                        <Box
                            sx={{
                                textAlign: 'center',
                                mt: 0,
                            }}
                        >
                            <Link
                                variant="body2"
                                href="https://support.mallcommapp.com/knowledge/adding-editing-cms-users-login-help"
                                sx={{
                                    color: '#4B5563',
                                }}
                            >
                                {t('auth.having_trouble_signing_in')}
                            </Link>
                        </Box>
                    </Box>
                </AbsoluteContent>
            </ContentWrapper>
        </OuterContainer>
    );
};

export default SelectAuth;
