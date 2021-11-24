const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, authentication) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread, authentication);
  }
}

module.exports = AddThreadUseCase;
