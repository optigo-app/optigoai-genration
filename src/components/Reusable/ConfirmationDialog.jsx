import React from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    IconButton
} from "@mui/material";
import { X, Check } from "lucide-react";
import { RADIUS } from "@/theme/tokens";

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon: Icon,
    variant = "primary",
    showCancel = true,
    actions = []
}) => {
    const colors = {
        primary: "#3f51b5",
        danger: "#ea4335",
        success: "#00a884"
    };

    const renderActions = () => {
        if (actions?.length > 0) {
            return actions.map((action, index) => (
                <Button
                    key={index}
                    fullWidth
                    onClick={() => {
                        action.onClick?.();
                        if (action.autoClose !== false) onClose();
                    }}
                    sx={{
                        py: 1.2,
                        borderRadius: "12px",
                        fontWeight: 600,
                        textTransform: "none",
                        background: "#f0f2f5",
                        color: action.danger ? "#ea4335" : colors.primary,
                        transition: "all 0.2s ease",
                        "&:hover": {
                            background: action.danger
                                ? "rgba(234,67,53,0.08)"
                                : "#e9edef",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
                        },
                        "&:active": {
                            transform: "translateY(0)",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                        }
                    }}
                >
                    {action.label}
                </Button>
            ));
        }

        return (
            <>
                {showCancel && (
                    <Button
                        fullWidth
                        onClick={onClose}
                        sx={{
                            py: 1.2,
                            background: "#f0f2f5",
                            color: "#54656f",
                            borderRadius: "12px",
                            fontWeight: 600,
                            textTransform: "none",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                background: "#e9edef",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
                            },
                            "&:active": {
                                transform: "translateY(0)",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                            }
                        }}
                    >
                        {cancelText}
                    </Button>
                )}

                <Button
                    fullWidth
                    onClick={onConfirm}
                    sx={{
                        py: 1.2,
                        borderRadius: "12px",
                        fontWeight: 600,
                        textTransform: "none",
                        color: "white",
                        background: colors[variant],
                        boxShadow: `0 4px 12px ${colors[variant]}33`,
                        transition: "all 0.2s ease",
                        "&:hover": {
                            background: colors[variant],
                            transform: "translateY(-2px)",
                            boxShadow: `0 6px 16px ${colors[variant]}55`
                        },
                        "&:active": {
                            transform: "translateY(0)",
                            boxShadow: `0 3px 8px ${colors[variant]}44`
                        }
                    }}
                >
                    {confirmText}
                </Button>
            </>
        );
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: RADIUS.lg,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        overflow: "visible",
                    }
                },
                backdrop: {
                    sx: {
                        backdropFilter: "blur(4px)",
                        backgroundColor: "rgba(0,0,0,0.6)"
                    }
                }
            }}
        >
            <DialogContent
                sx={{
                    pt: 5,
                    pb: 3,
                    px: 4,
                    textAlign: "center",
                    position: "relative"
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: "#667781",
                        bgcolor: "transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            bgcolor: "#f0f2f5",
                            color: "#111b21",
                            transform: "scale(1.1) rotate(90deg)"
                        },
                        "&:active": {
                            transform: "scale(0.95)",
                            bgcolor: "#e4e6e8"
                        }
                    }}
                >
                    <X size={20} />
                </IconButton>

                <Box
                    sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        background: `${colors[variant]}22`,
                        color: colors[variant]
                    }}
                >
                    {Icon ? <Icon size={34} /> : <Check size={34} />}
                </Box>

                <Typography
                    sx={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#111b21",
                        mb: 1
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        color: "#667781",
                        fontSize: "15px",
                        lineHeight: 1.5,
                        mt: 1,
                        mb: 3
                    }}
                >
                    {description}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 4,
                    pb: 3,
                    gap: 1.5,
                    flexDirection: actions.length > 2 ? "column" : "row"
                }}
            >
                {renderActions()}
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;