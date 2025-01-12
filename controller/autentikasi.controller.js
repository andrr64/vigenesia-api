import jwt from 'jsonwebtoken'; 

export const validasiToken = async (req, res) => {
  try {
    const { authToken, refreshToken } = req.body;

    if (!authToken || !refreshToken) {
      return res.status(400).json({
        status: false,
        message: 'Token tidak lengkap'
      });
    }

    // Cek apakah authToken masih valid
    try {
      const decodedAuth = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    } catch (err) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        
        // Jika refreshToken valid, buat authToken baru
        const newAuthToken = jwt.sign({ userId: decodedRefresh.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ userId: decodedRefresh.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        // Simpan token baru
        await saveNewTokens(decodedRefresh.userId, newAuthToken, newRefreshToken);

        return res.status(200).json({
          status: true,
          refresh: true,
          authToken: newAuthToken,
          refreshToken: newRefreshToken
        });
      } catch (refreshErr) {
        return res.status(401).json({
          status: false,
          message: 'Refresh token tidak valid'
        });
      }
    }

    // Jika authToken masih valid
    return res.status(200).json({
      status: true
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error'
    });
  }
}
