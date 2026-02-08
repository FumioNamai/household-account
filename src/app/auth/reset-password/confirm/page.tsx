import Password from "@/app/components/Password";
import { Box } from "@mui/material";

const ResetPasswordConfirmPage = () => {
  return (
    // パスワード変更
    <Box
      sx={{
        mx: 1.5,
        mt: 3,
      }}
    >
      <Password />
    </Box>
  );
};

export default ResetPasswordConfirmPage;
