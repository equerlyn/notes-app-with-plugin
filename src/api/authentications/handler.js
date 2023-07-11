const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-underscore-dangle */
class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    // Jangan lupa bind seluruh fungsi handler yang sudah dibuat dan
    // ekspor class AuthenticationsHandler agar dapat digunakan pada berkas JavaScript lain.
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      // memastikan payload request mengandung properti refreshToken yang bernilai string.
      this._validator.validatePutAuthenticationPayload(request.payload);

      // dapatkan nilai refreshToken pada request.payload dan
      // verifikasi refreshToken baik dari sisi database maupun signature token.
      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      /*
      Lihat kode dalam memverifikasi signature refresh token, di sana kita menampung
      nilai id dari objek payload yang dikembalikan this._tokenManager.verifyRefreshToken.
      Nilai id tersebut nantinya kita akan gunakan dalam membuat accessToken baru
      agar identitas pengguna tidak berubah.
      Setelah refreshToken lolos dari verifikasi database dan signature, sekarang kita bisa
      secara aman membuat accessToken baru dan melampirkannya sebagai data di body respons.
      */
      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      // validasi dulu request.payload, pastikan permintaan membawa payload yg berisi refreshToken.
      this._validator.validateDeleteAuthenticationPayload(request.payload);
      /*
      Setelah request.payload divalidasi, kita bisa dapatkan nilai refreshToken dari request payload
      untuk kemudian menghapus token tersebut dari database.
      Namun, sebelum menghapusnya kita perlu memastikan refreshToken tersebut ada di database.
      Caranya, gunakan fungsi this._authenticationsService.verifyRefreshToken.
      */

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      // Setelah proses verifikasi refreshToken selesai, kita bisa lanjut menghapusnya dari database
      // menggunakan fungsi this._authenticationsService.deleteRefreshToken.
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      // Terakhir, kita tinggal berikan respons yang sesuai skenario pengujian pada request ini.
      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AuthenticationsHandler;
