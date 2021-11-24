const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(req, h) {
    const { id: credentialId } = req.auth.credentials;
    const { title, body } = req.payload;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({
      title,
      body,
      owner: credentialId,
    });

    const res = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    res.code(201);
    return res;
  }
}

module.exports = ThreadsHandler;
