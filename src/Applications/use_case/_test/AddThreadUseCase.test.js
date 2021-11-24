const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Sebuah Thread',
      body: 'Isi dari thread',
    };
    const expectedAddedTread = new AddedThread({
      id: 'thread-123',
      title: 'Isi dari thread',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    const fakeAuth = 'user-123';
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedTread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, fakeAuth);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedTread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
      expectedAddedTread.owner,
    );
  });
});
