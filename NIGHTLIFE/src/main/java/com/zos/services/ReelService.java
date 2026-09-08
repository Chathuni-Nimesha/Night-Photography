package com.zos.services;

import java.util.List;

import com.zos.exception.ReeelException;
import com.zos.model.Reels;

public interface ReelService {
	
	public Reels createReels(Reels reel);
	
	public void deleteReels(Integer reelId, Integer userId) throws ReeelException;
	
	public void editReels(Reels reel);
	
	public List<Reels> getAllReels();

}
