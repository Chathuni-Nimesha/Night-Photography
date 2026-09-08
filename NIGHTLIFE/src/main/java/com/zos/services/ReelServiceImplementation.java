package com.zos.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zos.exception.ForbiddenException;
import com.zos.exception.ReeelException;
import com.zos.model.Reels;
import com.zos.repository.ReelRepository;

@Service
public class ReelServiceImplementation implements ReelService {
	
	@Autowired
	private ReelRepository reelRepository;

	@Override
	public Reels createReels(Reels reel) {
		return reelRepository.save(reel);
	}

	@Override
	public void deleteReels(Integer reelId, Integer userId) throws ReeelException {
		Reels reel = reelRepository.findById(reelId)
				.orElseThrow(() -> new ReeelException("Reel not found"));

		Integer ownerId = reel.getUser() != null ? reel.getUser().getId() : null;
		if (ownerId == null || userId == null || !ownerId.equals(userId)) {
			throw new ForbiddenException("You cannot delete this reel.");
		}

		reelRepository.deleteById(reelId);
	}

	@Override
	public void editReels(Reels reel) {
		reelRepository.save(reel);
	}

	@Override
	public List<Reels> getAllReels() {
		return reelRepository.findAll();
	}
}
